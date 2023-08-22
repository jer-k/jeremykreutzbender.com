---
title: Authenticate Github's Webhooks API using Elixir's Plug
date: "2019-08-17"
template: "post"
draft: false
slug: "github-webhook-authentication-with-elixir-plug"
category: "Programming"
tags:
  - "github"
  - "webhook"
  - "webhooks"
  - "elixir"
  - "plug"
  - "authenticate"
  - "authentication"
description: "Recently, I started working on a new side project in Elixir and I think I've finally found something I'm going to stick with; a service where we are required to add a label to our Pull Requests and a Slack channel is notified that the PR is ready to be reviewed"
socialImage:
---

Recently, I started working on a new side project in Elixir and I think I've finally found something I'm going to stick with! In the past I would either build something like a simple TODO app and not get far enough into the language or I would pick a gigantic idea and get nowhere due to how daunting it was. However, one of my co-workers recently implemented a feature through the [Github Webhooks API](https://developer.github.com/webhooks/) where we are required to add a label to our Pull Requests and a Slack channel is notified that the PR is ready to be reviewed. I decided that I wanted to rebuild it in Elixir and in doing so, be able to write about what I learn along the way; this is the first in what I hope to be many posts about my journey. With that said, if you're unfamiliar with the webhooks API or how to set it up on your repository, please read the link above because we're jumping right in!

We're going to create a [Plug](https://hexdocs.pm/plug/Plug.Router.html) that will read the secret from the webhooks API and halt the connection if the request does not authenticate. We'll start off with a basic outline of what we want to do.

```elixir
defmodule MyApp.Plugs.GithubAuthentication do
  import Plug.Conn

  def init(_params) do
  end

  def call(conn, _params) do
    with {:ok, digest} <- get_signature_digest(conn),
           {:ok, secret} <- get_secret(),
           {:ok} <- valid_request?(digest, secret, conn)
    do
      conn
    else
      _ -> conn |> send_resp(401, "Couldn't Authenticate") |> halt()
    end
  end

  defp get_signature_digest(conn) do
  end

  defp get_secret do
  end

  defp valid_request?(digest, secret, conn) do
  end
end
```

The first thing I want to note is that I never understood `with` until now. When it was introduced, the syntax threw me off and since I wasn't writing much Elixir at the time, it never clicked. However, I'm happy that I understand it now because it is the perfect construct for what we want to do.

First, we want to get the signature of the request that Github has sent. If we look at the [Payloads](https://developer.github.com/webhooks/#payloads) section of the API docs we'll see that Github adds a `X-Hub-Signature` header to each request. It is described as

> The HMAC hex digest of the response body.
> This header will be sent if the webhook is configured with a secret.
> The HMAC hex digest is generated using the sha1 hash function and the secret as the HMAC key.

which we will come back to a little later when we need to build the digest ourselves, but for now let's fill in `get_signature_digest` to grab the header from the request. Plug has a function to help us do this [get_req_header/2](https://hexdocs.pm/plug/Plug.Conn.html#get_req_header/2) so let's use that.

```elixir
defp get_signature_digest(conn) do
  case get_req_header(conn, "x-hub-signature") do
    ["sha1=" <> digest] -> {:ok, digest}
    _ -> {:error, "No Github Signature Found"}
  end
end
```

If we look at the [Example delivery](https://developer.github.com/webhooks/#example-delivery) from Github, it shows

```
X-Hub-Signature: sha1=7d38cdd689735b008b3c702edd92eea23791c5f6
```

so what we want to do is pattern match on the header value to ensure it is formed correctly with `sha1=` precreeding the digest and then return the digest.

Next we need to know the secret that was used to create the digest. For this example I'm going to use [Application.get_env](https://hexdocs.pm/elixir/Application.html#get_env/3).

```elixir
defp get_secret
  Application.get_env(:my_app, :github_secret)
end
```

However, this is a very basic use case that will work if we only have one a single key to handle, but what if we were building an application that handled requests from many repositories? That is what the project I'm working on will do so I need to be able to find the secrets based on the repository sending the event. While I'm not going to cover that implementation here, what it means is that I need to have the parsed request body available at the time `get_secret` is called; I would probably have a `get_secret/1` which took in the repository url. For now let's continue on, but we'll see why needing access to the parsed and raw response bodies matter.

Now that we have both the digest and the secret in hand, we need to rebuild the digest from the request to see if we have a match. Looking back at the description of the `X-Hub-Signature`, it starts off with `The HMAC hex digest of the response body.` What we need is access not to the parsed response body, but to the raw response body. Thankfully this exact type of functionality was added to Plug in the form of a [Custom body reader](https://hexdocs.pm/plug/Plug.Parsers.html#module-custom-body-reader); we just need to copy the docs into our application!

```elixir
defmodule MyApp.Plugs.CacheBodyReader do
  def read_body(conn, opts) do
    {:ok, body, conn} = Plug.Conn.read_body(conn, opts)
    conn = update_in(conn.assigns[:raw_body], &[body | (&1 || [])])
    {:ok, body, conn}
  end
end
```

We'll come back to where to put this code when we wrap up, but for now we know that `conn.assigns.raw_body` exists so let's put it to use in `valid_request?`.

```elixir
defp valid_request?(digest, secret, conn) do
  hmac = :crypto.hmac(:sha, secret, conn.assigns.raw_body) |> Base.encode16(case: :lower)
  if Plug.Crypto.secure_compare(digest, hmac), do: {:ok}, else: {:error}
end
```

We generate the hmac using Erlang's [crypto](http://erlang.org/doc/man/crypto.html#hmac-3) library and then encode it to lowercase to ensure it matches the form of Github's signature. At the very bottom of Github's [Securing your webhooks](https://developer.github.com/webhooks/securing/) they note

> Using a plain == operator is not advised.
> A method like secure_compare performs a "constant time" string comparison,
> which renders it safe from certain timing attacks against regular equality operators.

so to compare the two digests, we'll use [Plug.Crypto.secure_compare](https://hexdocs.pm/plug/Plug.Crypto.html#secure_compare/2). The entire Plug now looks like this.

```elixir
defmodule MyApp.Plugs.GithubAuthentication do
  import Plug.Conn

  def init(_params) do
  end

  def call(conn, _params) do
    with {:ok, digest} <- get_signature_digest(conn),
         {:ok, secret} <- get_secret(),
         {:ok} <- valid_request?(digest, secret, conn)
    do
      conn
    else
      _ -> conn |> send_resp(401, "Couldn't Authenticate") |> halt()
    end
  end

  defp get_signature_digest(conn) do
    case get_req_header(conn, "x-hub-signature") do
      ["sha1=" <> digest] -> {:ok, digest}
      _ -> {:error, "No Github Signature Found"}
    end
  end

  defp get_secret
    Application.get_env(:my_app, :github_secret)
  end

  defp valid_request?(digest, secret, conn) do
    hmac = :crypto.hmac(:sha, secret, conn.assigns.raw_body) |> Base.encode16(case: :lower)
    if Plug.Crypto.secure_compare(digest, hmac), do: {:ok}, else: {:error}
  end
end
```

Now we can create a [Router](https://hexdocs.pm/plug/Plug.Router.html) and test out our implementation.

```elixir
defmodule MyApp.Router do
  use Plug.Router

  plug(Plug.Logger)
  plug(Plug.Parsers,
    parsers: [:json],
    body_reader: {MyApp.Plugs.CacheBodyReader, :read_body, []},
    json_decoder: Jason)
  plug(MyApp.Plugs.GithubAuthentication)
  plug(:match)
  plug(:dispatch)

  post "events" do
    send_resp(conn, 200, "Successful Event!")
  end
end
```

The ordering of the plugs becomes important, remember that we want the parsed body available when we do the authentication so we need to put the `Parsers` plug above the `GithubAuthentication` plug. We need to add the `body_reader: {MyApp.Plugs.CacheBodyReader, :read_body, []},` line to ensure that the raw body is also available when we're trying to authenticate. Finally we'll add an endpoint to test the events and we should be good to go.

Let's try it out. I'm going to use [ngrok](https://ngrok.com) to expose a url Github can reach and then send over an event to ensure everything works. Then I'm going to change the secret in the application to "not_the_secret" and the response should be a 401.

```
Session Status                online
Session Expires               7 hours, 40 minutes
Version                       2.3.34
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://9f3e1658.ngrok.io -> http://localhost:4001
Forwarding                    https://9f3e1658.ngrok.io -> http://localhost:4001
Connections                   ttl     opn     rt1     rt5     p50     p90
                              2       0       0.00    0.00    0.19    0.23
HTTP Requests
-------------
POST /events                  200 OK
POST /events                  401 Unauthorized
```

We can look at those events in Github too.

![successful_event](media/successful_event.png)

![unauthorized_event](media/unauthorized_event.png)

We successfully added a plug to authenticate the Github Webhooks API! I'm super excited to keep working on this project and I hope that I'll have more to share in the future!
