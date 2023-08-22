---
title: Secure Docker Authentication with Pass on Alpine Linux
date: "2020-07-31"
template: "post"
draft: false
slug: "apline-linux-docker-authentication-with-pass"
category: "Programming"
tags:
  - "docker"
  - "authentication"
  - "authenticate"
  - "alpine-linux"
  - "pass"
  - "docker-credential-helpers"
description: "If you've ever encountered the above message when logging into Docker and thought to yourself 'Well it’s unencrypted but it works... I'll deal with it another day' then we've got something in common."
socialImage:
---

![insecure docker login](media/insecure_docker_login.png)

If you've ever encountered the above message when logging into Docker and thought to yourself "Well it’s unencrypted but it works... I'll deal with it another day" then we've got something in common. That day finally came when I was working on another blog post but realized that without a secure way to do a `docker login` I was never going to achieve a good working example to write about. I came across [docker-credential-helpers](https://github.com/docker/docker-credential-helpers) which looked like exactly what I needed. One of the recommended ways to store the encrypted passwords is with [pass](https://www.passwordstore.org/). However, once I started looking at `pass`, I wasn't really sure where to start on getting everything working. Apparently I was not alone because after some googling I came across an issue on the `docker-credential-helpers` Github titled [Document how to initialize docker-credentials-pass](https://github.com/docker/docker-credential-helpers/issues/102). After reading through all of the discussion I felt like I understood enough to set out and figure out once and for all how to get rid of the pesky Docker warning.

If you prefer, you can view the [Dockerfile](https://github.com/jer-k/alpine_docker_pass/blob/master/Dockerfile) on Github, otherwise continue reading and I'll show the entire file, then break down each piece.

```docker
# syntax = docker/dockerfile:experimental
FROM alpine

ENV USER=docker_user
ENV HOME=/home/$USER

RUN addgroup -S appgroup && adduser -u 1001 -S $USER -G appgroup

RUN apk --update upgrade && apk add --update  docker \
                                              gnupg \
                                              pass

# As of 7/10/2020 the latest release of docker-credential-helpers is 0.6.3
RUN wget https://github.com/docker/docker-credential-helpers/releases/download/v0.6.3/docker-credential-pass-v0.6.3-amd64.tar.gz \
    && tar -xf docker-credential-pass-v0.6.3-amd64.tar.gz \
    && chmod +x docker-credential-pass \
    && mv docker-credential-pass /usr/local/bin/ \
    && rm docker-credential-pass-v0.6.3-amd64.tar.gz

# Create the .docker directory, copy in the config.json file which sets the credential store as pass, and set the correct permissions
RUN mkdir -p $HOME/.docker/
COPY config.json $HOME/.docker/
RUN chown -R $USER:appgroup $HOME/.docker
RUN chmod -R 755 $HOME/.docker

# Create the .gnupg directory and set the correct permissions
RUN mkdir -p $HOME/.gnupg/
RUN chown -R $USER:appgroup $HOME/.gnupg
RUN chmod -R 700 $HOME/.gnupg

WORKDIR $HOME
USER $USER

COPY gpg_file.txt .

# Edit the gpg file to add our password and generate the key
RUN --mount=type=secret,id=gpg_password,uid=1001 cat gpg_file.txt | sed 's/gpg_password/'"`cat /run/secrets/gpg_password`"'/g' | gpg --batch --generate-key

# Generate the pass store by accessing and passing the gpg fingerprint
RUN pass init $(gpg --list-secret-keys dockertester@docker.com | sed -n '/sec/{n;p}' | sed 's/^[[:space:]]*//g')

# Login to Docker
ARG DOCKER_USER
RUN --mount=type=secret,id=docker_password,uid=1001 cat /run/secrets/docker_password | docker login --username $DOCKER_USER --password-stdin

# Using cat will keep the container running
CMD ["cat"]
```

Alright, that was the Dockerfile in its entirety so let's jump into explaining what is going on.

```docker
# syntax = docker/dockerfile:experimental
FROM alpine

ENV USER=docker_user
ENV HOME=/home/$USER

RUN addgroup -S appgroup && adduser -u 1001 -S $USER -G appgroup

RUN apk --update upgrade && apk add --update  docker \
                                              gnupg \
                                              pass
```

First off, I'm using features from Docker's [BuildKit](https://github.com/moby/buildkit) and the first line `# syntax = docker/dockerfile:experimental` enables these features. If you haven't read about the experimental features, you can do so [here](https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/experimental.md). I'm going to use [Alpine Linux](https://alpinelinux.org/) as my base image, as it has been my go to for building Docker images for quite some time now. I've added a user and set up a new home directory so that we can run the image as a non-root user. The last piece here is adding the packages we'll need: `docker` because that's what we're trying to log into, `gnupg` to generate a certificate for seeding `pass`, and `pass` to securely store our credentials.

```docker
# As of 7/10/2020 the latest release of docker-credential-helpers is 0.6.3
RUN wget https://github.com/docker/docker-credential-helpers/releases/download/v0.6.3/docker-credential-pass-v0.6.3-amd64.tar.gz \
    && tar -xf docker-credential-pass-v0.6.3-amd64.tar.gz \
    && chmod +x docker-credential-pass \
    && mv docker-credential-pass /usr/local/bin/ \
    && rm docker-credential-pass-v0.6.3-amd64.tar.gz
```

Next we'll install `docker-credential-helpers` and one of the first comments on the aforementioned issue [showed](https://github.com/docker/docker-credential-helpers/issues/102#issuecomment-388974092) how to do this. I just modified the release number to get the most up to date version.

```
# Create the .docker directory, copy in the config.json file which sets the credential store as pass, and set the correct permissions
RUN mkdir -p $HOME/.docker/
COPY config.json $HOME/.docker/
RUN chown -R $USER:appgroup $HOME/.docker
RUN chmod -R 755 $HOME/.docker
```

```
# config.json file

{
  "credsStore": "pass"
}
```

Now we need to create our `.docker` directory and ensure that our user has full control over it. We copy in the `config.json` file which tells Docker to use `pass` as a credential store.

```
# Create the .gnupg directory and set the correct permissions
RUN mkdir -p $HOME/.gnupg/
RUN chown -R $USER:appgroup $HOME/.gnupg
RUN chmod -R 700 $HOME/.gnupg
```

After a little bit of trial and error, I discovered that I needed a `.gnupg` directory with correct permissions before `gpg` would allow me to generate the key. With that, everything is now set up to start generating our secure login.

```
WORKDIR $HOME
USER $USER

COPY gpg_file.txt .

# Edit the gpg file to add our password and generate the key
RUN --mount=type=secret,id=gpg_password,uid=1001 cat gpg_file.txt | sed 's/gpg_password/'"`cat /run/secrets/gpg_password`"'/g' | gpg --batch --generate-key
```

```
# gpg_file.txt

# Example from https://www.gnupg.org/documentation//manuals/gnupg/Unattended-GPG-key-generation.html
%echo Generating a basic OpenPGP key
Key-Type: DSA
Key-Length: 1024
Subkey-Type: ELG-E
Subkey-Length: 1024
Name-Real: Docker Tester
Name-Email: dockertester@docker.com
Expire-Date: 0
Passphrase: gpg_password
# Do a commit here, so that we can later print "done" :-)
%commit
%echo done
```

There is a bit to unpack here, but first we set our `WORKDIR` to the `$HOME` directory and change from the root user to our `$USER`. Next we copy in the `gpg_file.txt` file shown above, which is a modified example from [gnupg.org](https://www.gnupg.org/documentation//manuals/gnupg/Unattended-GPG-key-generation.html). The `RUN` line can be broken down into a few different pieces so we'll go through it piece by piece.

`--mount=type=secret,id=gpg_password,uid=1001` is taking advantage of using [BuildKit secrets](https://github.com/moby/buildkit/blob/master/frontend/dockerfile/docs/experimental.md#run---mounttypesecret). If you want to read about BuildKit secrets, I would suggest the official Docker documentation [New Docker Build secret information](https://docs.docker.com/develop/develop-images/build_enhancements/#new-docker-build-secret-information), however the gist of this functionality is that the secret is only supplied to this single `RUN` command and is not left behind as an artifact in the layer. The command is saying to make available the mounted secret at `id=gpg_password` and access it as user 1001 (which we set when we generated the user).

As a side note, I would have created a `$USER_UID` environment variable instead of hard coding the uid, but this mount command cannot interpret a Docker environment variable (see BuildKit issue [815](https://github.com/moby/buildkit/issues/815)).

`cat gpg_file.txt | sed 's/gpg_password/'"&96cat /run/secrets/gpg_password&96"'/g' |` is piping the contents of our `gpg_file.txt` file into `sed` where we're doing a find on `gpg_password` and replacing it by accessing our mounted secret at and outputting the value through `cat`.

`gpg --batch --generate-key` is receiving the contents of the file, with our password in place and generating the key in unattended mode via the `--batch` flag. With that we've successfully generated a key we can use to seed `pass`.

```
# Generate the pass store by accessing and passing the gpg fingerprint
RUN pass init $(gpg --list-secret-keys dockertester@docker.com | sed -n '/sec/{n;p}' | sed 's/^[[:space:]]*//g')
```

Again we've got multiple commands on a single line so let's break those down.

`pass init` is ultimately what we're trying to accomplish which will initialize our password store.

`gpg --list-secret-keys dockertester@docker.com` is how the example from [gnupg.org](https://www.gnupg.org/documentation//manuals/gnupg/Unattended-GPG-key-generation.html) says to see the keys we've generated. The example output is as follows

```bash
$ gpg --list-secret-keys dockertester@docker.com
sec   dsa1024 2020-07-12 [SCA]
      D48ED9A99CFDDBD8B3D08A6EA4BEBAE5B209C126
uid           [ultimate] Docker Tester <dockertester@docker.com>
ssb   elg1024 2020-07-12 [E]
```

That output is piped into `sed -n '/sec/{n;p}'` which finds the match of `sec`, then goes to the `n`ext line and `p`rints it. A larger explanation can be found in [this Stack Overflow answer](https://unix.stackexchange.com/a/31535). This command returns ` D48ED9A99CFDDBD8B3D08A6EA4BEBAE5B209C126`, which is our gpg key, but it includes the whitespace.

The last command, `sed 's/^[[:space:]]*//g'`, takes in the key with the whitespace and removes all the whitespace so we're left with just the key, which is used by `pass init`. Now we're ready to securely log into Docker!

```
# Login to Docker
ARG DOCKER_USER
RUN --mount=type=secret,id=docker_password,uid=1001 cat /run/secrets/docker_password | docker login --username $DOCKER_USER --password-stdin
```

By calling `ARG DOCKER_USER` we're making that build argument available to us via `$DOCKER_USER`. Then we're using the same secret syntax as the previous `RUN` command, but this time accessing `docker_password` and piping the password into the `docker login` command that was suggested from the original warning output seen in the screenshot as the beginning of the article.

```
# Using cat will keep the container running
CMD ["cat"]
```

The final piece of the `Dockerfile` is the command, which is `cat` for the sole purpose of keeping the container running for this demo. Now that we've covered the contents of the `Dockerfile`, the next step is to build the image.

```
$ DOCKER_BUILDKIT=1 docker build -t alpine_docker_pass --secret id=gpg_password,src=gpg_password.txt --secret id=docker_password,src=docker_password.txt --build-arg DOCKER_USER=your_docker_username .
```

Let's do another breakdown.

`DOCKER_BUILDKIT=1` is the instruction to enable BuildKit.

`docker build -t alpine_docker_pass` is the standard `docker build` and tagging the image as `alpine_docker_pass`.

`--secret id=gpg_password,src=gpg_password.txt` and `--secret id=docker_password,src=docker_password.txt` are our BuildKit enabled arguments to mount text files as secrets in the image. Inside of each file I have a single line with the password.

`--build-arg DOCKER_USER=your_docker_username` is setting our build argument for `DOCKER_USER`. Don't forget to replace `your_docker_username` with your actual Docker username!

`.` finally the lonesome dot to instruct `docker build` to run in the current working directory.

If you to want stop here, I don't blame you. We've covered all the pieces of the `Dockerfile` and the command you'll need to properly build the image. What follows is the practical example, which takes a bit of set up. I won't be breaking everything down in as much detail to help with conciseness. We're going to set up a `docker-compose.yml` file that will use our built image and [dind](https://github.com/docker-library/docker/blob/93c19dff54de9876f736b3aa8026be5ad5987388/19.03/dind/Dockerfile) so we have a daemon to connect to. We'll run the images, exec into the container, and then ensure that everything works. Let's get to it!

```docker
version: '3'

services:
  alpine_docker_pass:
    image: localhost:5000/alpine_docker_pass:latest
    environment:
      DOCKER_HOST: tcp://docker:2376
      DOCKER_TLS_VERIFY: 1
      DOCKER_CERT_PATH: /certs/client
    volumes:
      - certs:/certs/client
    stdin_open: true
    tty: true

  docker:
    # Starts a Docker daemon at the DNS name "docker"
    # Note:
    #  * This must be called "docker" to line up with the default
    #    TLS certificate name
    #  * DOCKER_TLS_CERTDIR defaults to "/certs
    image: docker:19.03-dind
    privileged: yes
    volumes:
      - certs:/certs/client

volumes:
  certs:
```

Awhile ago I came across this article [How to Use the "docker" Docker Image to Run Your Own Docker daemon](https://www.caktusgroup.com/blog/2020/02/25/docker-image/) that explained how to set up a compose file with `dind`; it is a very good read and I highly recommend it. I borrowed most of the setup from that article, the only interesting thing to note here is `image: localhost:5000/alpine_docker_pass:latest`. We need a way to reference our locally built image and we can do that via `docker tag alpine_docker_pass:latest localhost:5000/alpine_docker_pass:latest`. The port on localhost can be anything; there does not need to be a real running server on that port. By tagging our image this way, we ensure that docker will pull our local image and not try to pull an image from Dockerhub. However, I have also pushed the same image to a private repository on my Dockerhub account so that I can test the authentication from the container for the purpose of this example. Let's run the compose file.

```
$ docker-compose up -d
$ docker exec -it alpine_docker_pass_alpine_docker_pass_1 /bin/bash
```

The following commands are run from inside the container and are denoted by the `bash-5.0` prefix.

```
bash-5.0$ docker pull itsjerk/alpine_docker_pass
Using default tag: latest
Error response from daemon: pull access denied for itsjerk/alpine_docker_pass, repository does not exist or may require 'docker login': denied: requested access to the resource is denied
```

First a quick test to show that we aren't authenticated and can't pull the image.

```
bash-5.0$ pass
Password Store
└── docker-credential-helpers
    └── aHR0cHM6Ly9pbmRleC5kb2NrZXIuaW8vdjEv
        └── itsjerk
bash-5.0$ pass docker-credential-helpers/aHR0cHM6Ly9pbmRleC5kb2NrZXIuaW8vdjEv/itsjerk
<mypassword>bash-5.0$
```

Next we can list out our saved passwords by calling `pass` and initiate the log in by calling `pass docker-credential-helpers/aHR0cHM6Ly9pbmRleC5kb2NrZXIuaW8vdjEv/itsjerk`. We are then prompted to put in our password which was in the `gpg_password.txt` file. `pass` will spit out your password (without a newline at the end!) if everything works. I have redacted my own password.

```
bash-5.0$ docker login
Authenticating with existing credentials...
Login Succeeded
bash-5.0$ docker pull itsjerk/alpine_docker_pass
Using default tag: latest
latest: Pulling from itsjerk/alpine_docker_pass
Digest: sha256:f35cfb2bd0887d32347e3638fd53df4ead898de309c516f8e16b959232b84280
Status: Image is up to date for itsjerk/alpine_docker_pass:latest
docker.io/itsjerk/alpine_docker_pass:latest
```

Finally we can log into Docker without having to supply our Docker password or receiving any warning! We test the authentication by pulling the same private image from before and see that we can successfully pull it.

If you made it all the way to the end, I hope you learned a thing or two; I definitely did while putting all this together! Overall this is a lot of work to ensure that your Docker password is stored in a secure way but it is always better to be on the safe side when it comes to container security.
