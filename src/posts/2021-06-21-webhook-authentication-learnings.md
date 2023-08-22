---
title: "Webhook Authentication Learnings for GitHub, GitLab, and Bitbucket"
date: "2021-06-21"
template: "post"
draft: true
slug: "webhook-authentication-learnings"
category: "Programming"
tags:
  - "gitlab"
  - "bitbucket"
  - "github"
  - "rails"
  - "webhooks"
  - "release"
description: ""
socialImage:
---

This blog post was originally posted on the [Release Blog](https://releasehub.com/blog). I have reposted this article here due to...

I was recently tasked with implementing Gitlab support for Release and to complete that task I needed to implement authentication for Gitlab and a way to handle their webhooks. I completed the authentication first and left the webhook implementation for another pull request as I wanted to refactor the way we were handling all webhooks.

As I started the webhook work, the state of how Release handled webhooks was that Github was using the [github_webhook](https://github.com/ssaunier/github_webhook) gem and Bitbucket was using some custom built code that lived in a Controller Concern. With the need to add a third client I wanted to align everything into a few classes that allow us to easily onboard more providers if the need ever arose.

As I finished up the work I thought it would be useful to share some things I found about the differences between the three providers and share some of the code that I wrote in case anyone else is trying to do a similar implementation. First I'll talk about a few things I came across and later, in the Technical Details section, I'll go over a few classes we're using in our Ruby on Rails project for handling the webhooks.

I enjoyed doing this work because it spanned a lot different aspects of our codebase, including designing a refactor that would allow for processing webhooks from three different sources, reading documentation and understanding three different APIs, and writing tests to ensure that as we move forward we shouldn't need to every worry about breaking our webhook processing.

### Authentication Methods

Further down in the Technical Details section, I'll show some code for the `Authenticator` class so you'll see the implementation around this topic, but I wanted to touch on how each of the three providers handles authenticating the webhooks. We'll start with Github.

- **Github** - With a Github App, when you create the App, you can supply a secret key which will be used as the basis for authenticating the webhooks for all repositories. Their approach is to combine the payload of the webhook and the secret to generate a hash. The generated hash will be passed as a header when the request is sent to you. The documentation gives an example in Ruby on how to generate your own version of the hash. Then, if the comparison of the two hashes matches, you know the authenticity of the request is valid. I would rate this as the most secure way of authenticating the webhooks because if the request were intercepted and decoded, the secret used to generate the hash is not present anywhere in the request. You can read Github's [Securing your webhooks documentation](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks) for yourself if you want to learn more

- **Gitlab** - Gitlab follows a similar approach to Github, except that a different webhook object must be created on Gitlab for each Repository (as opposed to the singular Github App). Each webhook installation can take in a secret as it is being created and that secret is sent with the webhook request in the headers. There is no generating of a hash like Github, the secret is simply added to the request. Due to the secret being sent in the header, we decided to generate a different secret for every Repository as we save the Repository in the database. This means that if a request were to be intercepted and decoded, at most a single Repository would be compromised. You can read Gitlab's [Webhook documentation](https://docs.gitlab.com/ee/user/project/integrations/webhooks.html) for yourself if you want to learn more.

- **Bitbucket Cloud** - Bitbucket is set up in a similar fashion to Gitlab where we have to create a webhook object for each Repository. However, unlike Gitlab, Bitbucket Cloud does not offer a way to add a secret. I came across a [JIRA Ticket](https://jira.atlassian.com/browse/BCLOUD-14683) that was created in 2017 outlining this omission of a way to secure the requests but it is currently still open. It is unfortunate that Bitbucket doesn't offer a way to authenticate the webhook requests as it would allow someone to potentially send requests with bad information. They do offer an alternative solution in their documentation about whitelisting specific IPs that the requests could come from, but my opinion is that they should implement adding the secret and at least follow in Gitlab's approach to send the secret in the headers. You can read Bitbucket Cloud's [Manange webhooks documentation](https://support.atlassian.com/bitbucket-cloud/docs/manage-webhooks/) for yourself if you want to learn more.

### The Action Is Separated From The Event

One aspect I really like with Github and Gitlab is that they differentiate their webhook request through an event and an action. The event is sent as a header in the request and an example would be `pull_request` (on Github) or `merge_request` (on Gitlab). There are many different things that can happen with a Pull Request though: it might be one of opened, closed, merged, reopened, and so on. Those different actions that could happen on the Pull Request are sent over in the payload as the key `action` with the value of the aforementioned states. From a coding perspective this event and action pattern allowed me to create a method, say `process_pull_request` and inside of that method, handle the many different actions that could occur in another method, say `pull_request_opened`. I found that designing the code this way allowed for a good abstraction and thorough unit testing of all the different action methods.

The outlier is Bitbucket which added the event and the action together in the header. For example, when a Pull Request is created, the header contains `pullrequest:created`, when closed `pullrequest:rejected`, and when merged `pullrequest:fulfilled`. When using Release for ephemeral environments, closing and merging a Pull Request are considered the same type of action: we will destroy that ephemeral environment. But since the header contains two different values, I had to implement two different methods: `process_pullrequest_rejected` and `process_pullrequest_fulfilled` which simply call another method. While it is a pretty minor inconvenience, I like the code pattern of the action and event separated compared to having them combined.

## Technical Details

First and foremost I want to acknowledge the great work on the [gitub_webhook](https://github.com/ssaunier/github_webhook) gem as I used a good amount of what they had done to create the foundation for the `Authenticator` and `Processor` classes. What follows is the Ruby code I wrote to manage the webhooks from the three providers that Release currently supports.

### The Authenticator

First up, we'll look at the `Authenticator` class. Its purpose is to authenticate the webhooks that we are receiving to ensure that they're valid. You'll see that there is an optional parameter for the Repository and it is optional because as I mentioned in the Authentication Methods above, for Github we have a single secret, while for Gitlab and Bitbucket a secret is generated for each Repository.

Aside from the initialization method, the class has a single public method, `authenticate_request!` which does as it is named. It will raise an error if the authenticity of the request cannot be validated otherwise the call will return. The `expected_signature` method follows the different providers implementations with Github needing to create a hash to compare, Gitlab needing only the secret, and Bitbucket currently using a random string due to not offering an authentication method.

```ruby
module Webhooks
  class Authenticator
    class SignatureError < StandardError; end

    def initialize(request:, vcs_type:, repository: nil)
      @request = request
      @vcs_type = vcs_type
      @repository = repository
    end

    def authenticate_request!
      secret = client_secret(@vcs_type, @repository)
      request_signature = signature_header(@vcs_type, @request)
      expected_signature = expected_signature(@vcs_type, secret, @request)

      unless ActiveSupport::SecurityUtils.secure_compare(request_signature, expected_signature)
        raise SignatureError
      end
    end

    private

    def request_body(request)
      @request_body ||= (
        request.body.rewind
        request.body.read
      )
    end

    def signature_header(vcs_type, request)
      @signature_header ||= (
        case vcs_type
        when :github
          @request.headers['X-Hub-Signature-256']
        when :gitlab
          @request.headers['X-Gitlab-Token']
        when :bitbucket
          'bitbucket_cloud'
        end
      )
    end

    def expected_signature(vcs_type, secret, request)
      digest = OpenSSL::Digest.new('sha256')

      case vcs_type
      when :github
        "sha256=#{OpenSSL::HMAC.hexdigest(digest, secret, request_body(request))}"
      when :gitlab
        secret
      when :bitbucket
        'bitbucket_cloud'
      end
    end

    def client_secret(vcs_type, repository)
      case vcs_type
      when :github
        Clients::Github.webhook_secret
      when :gitlab, :bitbucket
        repository.webhook_secret
      end
    end

  end
end
```

### The Processor

If the request is authenticated, then we need to process the payload that comes with the request and the `Processor` class does just that. It will look through the payload and try to find the associated Repository in our database, if that Repository cannot be found, then an error occurs. To determine what event occurred, we look through the different headers in the request and parse the value into Ruby method declaration form by replacing any non-word character with an underscore. Based on the provider who sent the request, a service object is initialized and then we attempt to call a `process_` method. Some webhooks we receive are for things Release doesn't deal with, for example Github's `issues` webhooks, so we safely `try` the method as there may not be an implemented `process_` method.

```ruby
module Webhooks
  class Processor
    def initialize(request, vcs_type)
      @request = request
      @payload = json_body(request)
      @vcs_type = vcs_type
      @repository = repository_from_payload(@vcs_type, @payload)

      @webhook_service = webhook_service(@vcs_type, @payload, @repository)
    end

    def repository
      @repository
    end

    def process_webhook
      process_method = "process_#{event_method(@vcs_type, @request)}"
      @webhook_service.try(process_method)
    end

    private

    def json_body(request)
      payload = request.body.read
      ActiveSupport::HashWithIndifferentAccess.new(JSON.load(payload))
    end

    def repository_from_payload(vcs_type, payload)
      provider_repository_id = provider_repository_id(vcs_type, payload)
      if provider_repository_id
        Repository.find_by!(type: "Repositories::#{vcs_type.capitalize}", provider_repository_id: provider_repository_id)
      end
    rescue ActiveRecord::RecordNotFound => error
      # Re-Raise the error with info from the payload so we know what the repository is
      repository_info = payload.dig('repository', 'full_name')
      new_error = ActiveRecord::RecordNotFound.new(error.message + "Repository Info: #{repository_info}")
      new_error.set_backtrace(error.backtrace)
      raise new_error
    end

    def provider_repository_id(vcs_type, payload)
      case vcs_type
      when :github
        payload.dig('repository', 'id')
      when :gitlab
        payload.dig('project', 'id')
      when :bitbucket
        payload.dig('repository', 'uuid')
      else
        nil
      end
    end

    def event_method(vcs_type, request)
      @event_method ||=
        (
          case vcs_type
          when :github
            request.headers['X-GitHub-Event']
          when :gitlab
            request.headers['X-Gitlab-Event']
          when :bitbucket
            request.headers['X-Event-Key']
          else
            nil
          end
        )&.downcase&.gsub(/\W/, '_')&.to_sym
    end

    def webhook_service(vcs_type, payload, repository)
      service_class = "Webhooks::#{vcs_type.to_s.capitalize}"
      service_class.constantize.new(payload, repository)
    end
  end
end
```

### Github Webhook Service

The last method in `Processor`, `webhook_service` returns a service class that goes through our internal business logic of what we want to do with
the webhook. I'm going to provide a small snippet of the Github service when we receive a Pull Request webhook. If you recall, I mentioned this method in the _The Action Is Separated From The Event_ section and how I liked this pattern of structuring the code. If someone else were to look at this code, I would hope they would find it easy to understand that anything to do with Github Pull Request webhooks happens inside of the `process_pull_request` method and the `case` statement handles all the different actions that can take place.

```ruby
module Webhooks
  class Github
    def initialize(payload, repository)
      @payload = payload
      @action = @payload.dig('action')

      @repository = repository
    end

    def process_pull_request
      if @action.nil?
        error_message = "ERROR: Pull Request no action received, payload : #{@payload}, do nothing"
        Rails.logger.error(error_message)
      else
        message = "Pull Request with action : *#{@action}*. Received Repository : #{@repository.name}."
        Rails.logger.info(message)

        case @action
        when 'opened', 'reopened'
          pull_request_opened
        when 'closed'
          pull_request_closed
        when 'labeled'
          pull_request_labeled
        else
          message = "Pull Request with action : *#{@action}*. Nothing to do for now."
          Rails.logger.info(message)
        end
      end
    end
  end
end
```

### The Controller

The final piece to tie everything together is the controller. `WebhooksController` is the base class and each subclass implements only the `vcs_type` method. Our previous approach had custom code for each of the `Webhooks::GithubController` and `Webhooks::BitbucketController`. This meant that each required a ton of specific tests to ensure that we were processing all the different webhooks correctly. My refactored approach moved all that logic out of the controller and aimed for the smallest footprint possible to make testing as simple as possible.

There is only one route in the controller, which is a `POST` to `create`. I decided that since the Repository may be optional in the `Authenticator` that I will store it in the `Processor` and pass it into the `Authenticator`. Otherwise you can see that the public methods for each of the classes are called. If an error is raised by either, due to an unauthenticated webhook or possibly a webhook for a Repository we don't have in our database, we'll capture the error and log as much information as possible so that we can look into what went wrong.

```ruby
class Webhooks::GithubController < WebhooksController
  vcs_type(:github)
end
```

```ruby
class WebhooksController < ActionController::Base
  skip_before_action :verify_authenticity_token

  def self.vcs_type(vcs_name)
    define_method :vcs_type do
      vcs_name
    end
  end

  rescue_from StandardError do |error|
    payload = @webhook_service&.payload

    backtrace_cleaner = ActiveSupport::BacktraceCleaner.new
    cleaned_backtrace = backtrace_cleaner.clean(error.backtrace)

    error_message = "Error in #{self}! Message : #{error.message}\nPayload : #{payload}\nBacktrace : #{cleaned_backtrace.join("\n")}"
    Rails.logger.error(error_message)
    head :bad_request
  end

  def create
    processor = Webhooks::Processor.new(request, vcs_type)
    repository = processor.repository

    authenticator = Webhooks::Authenticator.new(request: request, vcs_type: vcs_type, repository: repository)
    authenticator.authenticate_request!

    processor.process_webhook

    head :ok
  end
end
```

## Conclusion

That's a wrap on my stint in refactoring our webhook code to work with Github, Bitbucket, and Gitlab. If we ever have to add another provider I think it will be quite straightforward and I hope you enjoyed taking a peek inside some development work at Release. If you're interested in having an ephemeral environment created whenever we receive a Pull Request webhook from your Repository, head on over to the [homepage](https://releasehub.com) and sign up!
