---
title: "How Release Uses Action Cable and Redux Toolkit"
date: "2021-07-15"
template: "post"
draft: true
slug: "how-release-uses-action-cable-redux-toolkit"
category: "Programming"
tags:
  - "react"
  - "redux"
  - "rails"
  - "actioncable"
  - "release"
description: ""
socialImage:
---

This blog post was originally posted on the [Release Blog](https://releasehub.com/blog). I have reposted this article here due to...

Over the past few weeks at [Release](https://releasehub.com) the Frontend Engineering team has started working on adding Redux to Release. We had been making use of [React Context](https://reactjs.org/docs/context.html) but felt that we were starting to stretch its capabilities. In some places we were having to add multiple providers to implement new features. After some research on the current state of Redux, we decided to go with [Redux Toolkit](https://redux-toolkit.js.org/) and [Redux Saga](https://redux-saga.js.org/). Moving all our data into the Redux store and out of local state meant that we were going to have to change our approach with [Action Cable](https://guides.rubyonrails.org/action_cable_overview.html) and how we were going to receive the messages, store them, and display changes for the user.

### Action Cable, Redux, and Release

Release uses Action Cable in a single direction, which is from the backend to the frontend. The frontend is a separate React application running as a [Static Service Application](https://docs.releasehub.com/reference-guide/static-service-deployment), not a part of Rails. The backend will send messages to the frontend when the state of objects change or to stream logs of deployments and builds. Today I’m going to go through the thought process, including code snippets, of how we set up our Redux implementation for Action Cable when Release builds a Docker image. If you’re curious about how Release builds Docker images, read about we [Cut Build Time In Half with Docker’s Buildx Kubernetes Driver](https://releasehub.com/blog/cutting-build-time-in-half-docker-buildx-kubernetes).

### Action Cable Setup

Let’s start off with how we set up the backend to send updates as a `Build` object progresses. We have two `ActiveRecord` models to consider in this scenario, `Build`, and `Log`. The `Build` class includes the [aasm](https://github.com/aasm/aasm) gem functionality to progress it through the lifecycle of actually creating a Docker build. The following is an extremely pared down version of our `Build` class, but has enough information to explain how we’re sending the Action Cable messages.

```ruby
class Build < ApplicationRecord
  include AASM
  include Logging

  has_many :logs

  aasm use_transactions: false do
    state :ready, initial: true
    state :running, after_enter: Proc.new { update_started_at; log_start }
    state :done, after_enter: Proc.new { set_duration; log_done }
    state :errored, after_enter: Proc.new { set_duration; log_error }

    event :start do
      transitions from: [:ready], to: :running
    end

    event :finish do
      transitions from: [:running], to: :done
    end

    event :error do
      transitions from: [:running], to: :errored
    end

  def log_start
    message = "Build starting for #{repository.name}!"
    log_it(:info, message, metadata: log_metadata)
  end

  def log_done
    message = "Build finished for #{repository.name}!"
    log_it(:info, message, metadata: log_metadata)
  end

  def log_error
    message = "Build errored for #{repository.name}!"
    log_it(:error, message, metadata: log_metadata)
  end

  def log_metadata
    {
      build_id: self.id,
      aasm_state: self.aasm_state,
      started_at: self.started_at,
      duration: self.total_duration
    }
  end

  def logs_channel
    "build_channel_#{self.id}"
  end
end
```

Whenever the `Build` transitions its state, we create a `Log` record through the `log_it` method. A log level is supplied, along with the message, and metadata about the `Build` itself. That metadata is used by the frontend to make changes for the user as you’ll see when we go through the Redux code. `log_it` also sends the message to the `logs_channel` through Action Cable. Since that wasn’t defined above, let’s look at that now.

```ruby
module Logging
  module Log
    def log_it(level, message, metadata: {})
      log_hash = {
        level: level,
        message: message.dup.force_encoding('UTF-8')
      }

      self.logs << ::Log.new(log_hash)

      payload = log_hash.merge(metadata)
      ActionCable.server.broadcast(logs_channel, payload)
    end
  end
end
```

There is not too much to it. We create the `Log` record and ensure the message is properly encoded. Then we combine the level, message, and supplied metadata to Action Cable and broadcast it. We use the `log_it` method with more classes than just `Build` and have found it makes for an easy and reliable way to store and send messages.

That takes care of our state transitions. The last piece needed to wrap up our backend setup is to create the `BuildChannel`.

```ruby
class BuildChannel < ApplicationCable::Channel
  def subscribed
    Rails.logger.info "Subscribing to: build_channel_#{params['room']}"
    stream_from "build_channel_#{params['room']}"
  end
end
```

The method receives a room parameter to ensure we are sending messages about a specific `Build` and does not go to everyone. I like to have the logging message in there so that it is easy to tell in the Rails logs if the frontend has successfully connected to the channel. With all that covered, we’re ready to dive into the setup on the frontend to receive those messages!

### Redux Setup

![Release Build Screen](media/Release-Build-Page.png)

As you’ll recall we’re using Redux Toolkit and we’re not going to cover our entire setup with Toolkit, instead focusing only on the portions relevant to updating the `Build` when we receive an Action Cable message. From there we’ll go over a small wrapper component we made to handle receiving the Action Cable messages and tie it all together with a small demo component.

We’ll start off with the `BuildsSlice`.

```javascript
import { createSlice } from "@reduxjs/toolkit";

import { handleBuildMessageReceived } from "./helpers/actionCable/builds";

const initialState = {
  activeBuild: undefined, // object
};

export const buildsSlice = createSlice({
  updateBuildFromMessage(state, action) {
    const message = action.payload;

    const build = state.activeBuild;
    const newBuild = handleBuildMessageReceived(build, message);

    return {
      ...state,
      activeBuild: newBuild,
    };
  },
});

export const { updateBuildFromMessage } = buildsSlice.actions;

export default buildsSlice.reducer;
```

You’ll notice that we import `handleBuildMessageReceived` from a file under `helpers/actionCable`. We wanted to separate out the code for the logic of updating the build from the slice itself so that our slice file does not grow too enormous. Other than that, the slice itself follows the suggested setup of a slice from the [createSlice](https://redux-toolkit.js.org/api/createslice) documentation.

Now we need to look at our `handleBuildMessageReceived` function.

```javascript
const handleBuildMessageReceived = (build, message) => {
  const buildId = message["build_id"];
  const aasmState = message["aasm_state"];
  const duration = message["duration"];
  const startedAt = message["started_at"];
  const level = message["level"];
  const messageLog = message["message"];

  const logs = build.logs;

  if (build.id !== buildId) {
    return build;
  } else {
    const newLogLine = { level: level, message: messageLog };
    const newBuild = {
      ...build,
      logs: [...logs, newLogLine],
      aasm_state: aasmState || build.aasm_state,
      total_duration: duration || build.total_duration,
      started_at: startedAt || build.started_at,
    };
    return newBuild;
  }
};

export { handleBuildMessageReceived };
```

First a sanity check is done to ensure we didn’t somehow receive a message for a `Build` that we aren’t viewing. This shouldn’t happen because we open and close our Action Cable subscriptions when we enter and leave a page, but an extra check never hurts. Then we construct a new `Build` object by appending the new log line and adding the metadata. If the metadata fields are `undefined`, we’ll retain what the `build` variable already had.

We’re ready to receive messages so we need a component that will handle that for us. The `ActionCableWrapper` component is just that.

```javascript
import React, { useEffect, useState } from "react";
import actionCable from "actioncable";

export default function ActionCableWrapper({ channel, room, onReceived }) {
  const [actionCableConsumer, setActionCableConsumer] = useState(undefined);

  useEffect(() => {
    if (!actionCableConsumer) {
      setActionCableConsumer(
        actionCable.createConsumer("ws://localhost:3000/cable")
      );
    } else {
      actionCableConsumer.subscriptions.create(
        { channel, room },
        {
          received: onReceived,
        }
      );
    }

    return () => {
      if (actionCableConsumer) {
        actionCableConsumer.disconnect();
      }
    };
  }, [actionCableConsumer]);

  return <></>;
}
```

This component will mount and check to see if `actionCableConsumer` is not `undefined`. However, if it is `undefined`, which it will be on the first pass through the `useEffect`, we will create a consumer through `actionCable.createConsumer` connecting to a `/cable` endpoint. `"ws://localhost:3000/cable"` is hard coded but the URL should come from an environment variable so the component works locally or in production. That consumer is set into the local state `actionCableConsumer` and the `useEffect` will trigger a second time.

In the second pass through, the `else` block is entered and a subscription is created with the passed in `channel`, `room`, and `onReceived` properties. The `return` function is set to call `disconnect()` if we have an `actionCableConsumer` set and will ensure that no web socket connections are left open if a user navigates away from the page. With that, we have a reusable component that will take care of our Action Cable needs throughout the application.

Pulling it all together, we can create a demo component that will display the state and logs and update whenever it receives a message.

```javascript
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid } from "@material-ui/core";

import ActionCableWrapper from "../ActionCableWrapper";

import { updateBuildFromMessage } from "redux/slices/builds";

export default function BuildDetailsCard(props) {
  const dispatch = useDispatch();
  const build = useSelector((state) => state.builds.activeBuild);

  const handleMessageReceived = (message) =>
    dispatch(updateBuildFromMessage(message));

  return (
    <>
      <ActionCableWrapper
        channel="BuildChannel"
        room={build.id}
        onReceived={handleMessageReceived}
      />
      <Grid container>
        <Grid item xs={3}>
          <div>
            <b>Repository Name:</b> {build.repository.name}
          </div>
          <div>
            <b>Commit Message:</b> {build.commit_message}
          </div>
          <div>
            <b>Commit SHA:</b> {build.commit_short}
          </div>
          <div>
            <b>State:</b> {build.aasm_state}
          </div>
        </Grid>
        <Grid
          item
          xs={9}
          style={{
            border: "2px",
            backgroundColor: "#343a40",
            fontSize: "0.9rem",
            fontFamily: "Monaco",
            color: "white",
            padding: 10,
          }}
        >
          {build.logs.map((log) => (
            <div>{log.message}</div>
          ))}
        </Grid>
      </Grid>
    </>
  );
}
```

For demo purposes I probably went a little overboard with the styling, but I wanted to create something that resembles our actual application which you saw at the start of this post. The two things needed to power the page are the build, which is retrieved with `useSelector` and the `handleMessageReceived` function, which dispatches `updateBuildFromMessage` every time we receive a message through Action Cable. We supply the `”BuildChannel”` and `build.id` as the channel and room to `ActionCableWrapper` along with `handleMessageReceived` as the `onReceived` function.

In the video below I’ll move the build through its different states and we’ll be able to see the frontend receive the messages, update the state, and add the logs to the screen.

![Release Demo Build Component](media/Release-Demo-Build-Component.gif)

### Conclusion

That's a wrap on my adventure into how we set up our Action Cable integration with Redux Toolkit. There are tons of places in the application we’re going to be adding live updates too so that our users will always be up to date on the state of their application. I hope you enjoyed taking a peek inside some development work at Release. If you're interested in having an ephemeral environment created whenever we receive a Pull Request webhook from your Repository, head on over to the [homepage](https://releasehub.com) and sign up! If you’d like to join our awesome team, check out our [job listsings](https://releasehub.com/company).
