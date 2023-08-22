---
title: "Cutting Build Time In Half with Docker’s Buildx Kubernetes Driver"
date: "2021-02-17"
template: "post"
draft: true
slug: "cutting-build-time-in-half-docker-buildx-kubernetes"
category: "Programming"
tags:
  - "docker"
  - "buildx"
  - "kubernetes"
  - "release"
description: ""
socialImage:
---

This blog post was originally posted on the [Release Blog](https://releasehub.com/blog). I have reposted this article here due to...

At Release, environments are our main focus, but we can’t create environments without builds. Recently we undertook a project to revisit our build infrastructure and determine if it needed to be upgraded. Build times had become a big factor in our service delivery and we needed a way to improve our customers’ experiences. One of the main areas that we wanted to improve upon was the parallelism of building multiple docker images for a single application.

The title of the article already spoiled the solution, and the alternative ‘Release Did This One Thing To Cut Their Build Time In Half!’ didn’t quite fly with the rest of the company, but Docker’s new [buildx](https://github.com/docker/buildx) project fit the bill. First, we’ll cover what our original infrastructure looked like and how long builds on an example project were taking. Then, we’ll describe the changes we made to use buildx and the speed increases we observed.

Let’s start off with a diagram of what our original infrastructure looked like.

![release-builder-architecture](media/release-builder-architecture.png)

As you can see, the requests for builds would flow into our main Rails application and then divvied out to the different builder instances through Sidekiq. The `builder` container is Ruby code that would authenticate to Github, clone the repository, check out the correct SHA, and then execute the `docker build`. Due to the way we built the authentication to pull the code from Github, a single `builder` container could only clone one repository at a time. Which meant that the container could only do a single build request at a time. We added threading in the Ruby code to be able to execute multiple `docker build` commands at a time, but the number of builder containers we had spun up limited our concurrent builds. While it’s not hard to horizontally scale with Kubernetes, we saw this authentication setup as a major bottleneck.

Another issue we encountered was that we had no mechanism for attempting to place builds on servers where they had been previously built, instead opting for grabbing the first free server. This meant there was very little chance to land on the same server and get the full benefit of Docker caching. While this isn’t a deal breaker for us, we still believed we could do better when creating the version of our build infrastructure. Enough of the theoretical, let’s actually build something!

Release Applications can contain many docker images and one of our favorite example repositories to showcase this is our fork of [example-voting-app](https://github.com/awesome-release/release-example-voting-app). Looking at the [docker-compose](https://github.com/awesome-release/release-example-voting-app/blob/master/docker-compose.yml) we see that there are 3 different Docker images that we have to build, `result`, `vote`, and `worker`. Now that we have an understanding of Release’s original infrastructure and the application we want to build, let’s start up a fresh build and see the results.

_NOTE_ I forked the `awesome-release` repo to my own Github, `jer-k` for the following results.

![uncached-release](media/release-build-uncached.png)

We can see that this brand new build with no cache hits took two minutes and 15 seconds to complete. Next, we want to make a few changes to ensure that each Docker image needs to be rebuilt. The changes are listed below.

```
git status
On branch release_builders
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
	modified:   result/views/index.html
	modified:   vote/app.py
	modified:   worker/src/main/java/worker/Worker.java

```

For the purpose of this blog post, I ensured the following build ran on the same builder as the first and that we will have cache hits. As noted before, this wasn’t always the case in our production environment.

![cached-release](media/release-build-cached.png)

The caching helps and cuts 45 seconds off the build! The uncached build took almost twice as long as the second build with caching, but our assumption was that we could do a lot better (cached and uncached) with some new technology.

# Enter Docker's Buildx Kubernetes Driver

One of the first things we wanted to solve was the concurrency issue and we set out to ensure that Docker itself was able to handle a larger workload. We came across the issue [Concurrent "docker build" takes longer than sequential builds](https://github.com/moby/moby/issues/9656) where people were describing what we feared; Docker slowed down when many builds were being run at the same time. Lucky for us, that issue was opened in 2014 and plenty of work had been done to resolve this issue. The final comment, by a member of the Docker team, was ["Closing this. BuildKit is highly optimized for parallel workloads. If you see anything like this in buildkit or buildkit compared to legacy builder please report a new issue with a repro case."](https://github.com/moby/moby/issues/9656#issuecomment-610476810) Thus we set out to learn more about [BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/) (the Github repository is located [here](https://github.com/moby/buildkit)). While researching, we came across [buildx](https://github.com/docker/buildx), which ended up having three key features we believed would resolve many of our issues. These three features were the [bake](https://github.com/docker/buildx#buildx-bake-options-target) command, the [buildx kubernetes driver](https://github.com/docker/buildx#--driver-driver), and the ability for the Kubernetes driver to consistently send builds to the same server. Let’s cover each of these, first up the `bake` command.

```
buildx bake [OPTIONS] [TARGET...]
Bake is a high-level build command.

Each specified target will run in parallel as part of the build.
```

`bake` intrigued us because it seemed to be a built-in command for us to avoid using Ruby threading for our parallelism. `bake` takes an input of a file, which can either be in the form of a `docker-compose`, `.json`, or `.hcl`. We initially tested `bake` with the docker-compose from example-voting-app and we were blown away at how smoothly it built directly out of the box and how quickly it was able to build the three images! However, we opted to create our own `.json` file generator in Ruby, parsing our [Application Template]() into an output. Here is our generated file for example-voting-app.

```json
{
  "group": {
    "default": {
      "targets": ["vote", "result", "worker"]
    }
  },
  "target": {
    "vote": {
      "context": "./vote",
      "tags": [
        "<REDACTED>.dkr.ecr.us-west-2.amazonaws.com/jer-k/release-example-voting-app/vote:latest",
        "<REDACTED>.dkr.ecr.us-west-2.amazonaws.com/jer-k/release-example-voting-app/vote:buildx-builders"
      ]
    },
    "result": {
      "context": "./result",
      "tags": [
        "<REDACTED>.dkr.ecr.us-west-2.amazonaws.com/jer-k/release-example-voting-app/result:latest",
        "<REDACTED>.dkr.ecr.us-west-2.amazonaws.com/jer-k/release-example-voting-app/result:buildx-builders"
      ]
    },
    "worker": {
      "context": "./worker",
      "tags": [
        "<REDACTED>.dkr.ecr.us-west-2.amazonaws.com/jer-k/release-example-voting-app/worker:latest",
        "<REDACTED>.dkr.ecr.us-west-2.amazonaws.com/jer-k/release-example-voting-app/worker:buildx-builders"
      ]
    }
  }
}
```

There are other inputs which can make their way into this file, such as build args, but since example-voting-app does not have any, they are omitted.

Next, we wanted to find more information on the Kubernetes driver and we found this blog post [Kubernetes driver for Docker BuildX](https://medium.com/nttlabs/buildx-kubernetes-ad0fe59b0c64) from the author of the [Pull Request](https://github.com/docker/buildx/pull/167). We encourage you to read the latter as it covers getting up and running with the Kubernetes driver as well how the caching works, which is exactly what we needed. With that information in hand, we were able to start work on adding the buildx servers to our cluster. We created a generic way to deploy the servers into different clusters and adjust the number of replicas with the final command being

```
docker buildx create --name #{name} --driver kubernetes --driver-opt replicas=#{num_replicas},namespace=#{builder_namespace} --use
```

For us, we created a `release-builder` namespace with five replicas, in our development cluster. We can see the output by querying for the pods

```
kubectl get pods --namespace=release-builder
NAME                            READY   STATUS    RESTARTS   AGE
development0-86d99fcf46-26j9f   1/1     Running   0          6d10h
development0-86d99fcf46-5scpq   1/1     Running   0          6d13h
development0-86d99fcf46-jkk2b   1/1     Running   0          15d
development0-86d99fcf46-llkgq   1/1     Running   0          18d
development0-86d99fcf46-mr9jt   1/1     Running   0          20d
```

Since we have five replicas, we wanted to ensure that when we build applications, they end up on the same server so that we get the greatest amount of caching possible (distributed caching is a topic for another day). Luckily for us, `buildx`, with the Kubernetes driver, has an option for where to send the builds called `loadbalance`.

```
loadbalance=(sticky|random) - Load-balancing strategy.
If set to "sticky", the pod is chosen using the hash of the context path. Defaults to "sticky"
```

The default `sticky` means that the builds should always end up on the same server due to the hashing (more detailed information on this is described in the aforementioned blog post). With all of that in place, we are ready to test out our new setup!

Using the same example-voting-app repository as before, I created a new branch `buildx_builders` and pointed the code to the buildx servers.

![uncached-buildx](media/release-buildx-uncached.png)

What we see is that this uncached build was more than twice as fast as the other uncached build and even faster than the cached build on the old infrastructure! But uncached builds should be a thing of the past with the sticky load balancing, so let’s make the same changes as the previous branch and see the results.

![cached-buildx](media/release-buildx-cached.png)

This build finished three times faster than the previous cached build! These types of speed increases are the reason we set out to redo our build infrastructure. The faster the builds complete, the faster we can create environments and help our customers deliver their products.

We’re still experimenting with `buildx` and learning as we go, but the initial results were more than enough for us to migrate our own production builds to the new infrastructure. We’re going to continue to blog about this topic as we learn more and scale so check back in with the Release blog in the future!
