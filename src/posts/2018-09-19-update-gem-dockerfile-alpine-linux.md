---
title: Update - Ruby Gem Dockerfile with Alpine Linux
date: "2018-09-19"
template: "post"
draft: false
slug: "update-gem-dockerfile-alpine-linux"
category: "Programming"
tags:
  - "ruby"
  - "rails"
  - "ruby-gems"
  - "ruby-on-rails"
  - "postgres"
  - "postgresql"
  - "database"
  - "docker"
  - "alpine-linux"
description: "I realized that we are always using Ruby Alpine images, and not the base Ruby image. I wanted to standardize the Dockerfiles I had written at work and here for the blog so I decided to look into what it would take to do so."
socialImage:
---

An update to my post on [adding a testing environment to a gem](https://jer-k.github.io/testing-and-developer-scripts-for-active-record-gem/). After doing some recent updates to our Docker images at work, I realized that we are always using Ruby Alpine images, and not the base Ruby image. I can't remember why I built the gem's Dockerfile using the base Ruby image, perhaps I had just overlooked the fact that we used Ruby Alpine, but I wanted to standardize the Dockerfiles I had written at work and here for the blog so I decided to look into what it would take to do so.

First, why choose an Alpine image? Many other developers have covered this topic in their blog posts and I think it's best not wander down that path again. Instead we'll look at a couple interesting snippets and move onto implementation details.

**"Alpine Linux is a very tiny Linux distribution. It’s built on BusyBox, and it includes only the minimum files needed to boot and run the operating system."**

from Ilija Eftimov's [Build a Minimal Docker Container for Ruby Apps](https://blog.codeship.com/build-minimal-docker-container-ruby-apps/) blog post, which is a great in-depth overview about going building a Ruby application from scratch with Docker and Alpine Linux.

**"Debian based base images may be easier to start with but it comes with the cost of image size (Image 2). It is almost six times bigger than image based on Alpine Linux."**

from Lauri Nevala's [Dockerizing Ruby Application](https://ghost.kontena.io/dockerizing-ruby-application/) blog post, which details the different base images that are available for Ruby and goes through an example of building a Ruby application with Docker and Alpine Linux.

First let's look at the updated [Dockerfile](https://github.com/jer-k/gem_with_database/blob/master/Dockerfile).

```dockerfile
FROM ruby:2.5.0-alpine
WORKDIR /usr/src/app/

RUN apk --update add --no-cache --virtual run-dependencies \
  bash \
  build-base \
  postgresql-client \
  postgresql-dev \
  git

#Copy the gem files into the WORKDIR
COPY gem_with_database.gemspec .
COPY Gemfile .
COPY lib/gem_with_database/version.rb lib/gem_with_database/

RUN bundle check || bundle install

COPY . .
```

And let's dive into the changes as seen in the [commit](https://github.com/jer-k/gem_with_database/commit/c08c2903310db2acb1bc7e0afda5e69c4e7605ec) where I made this conversion.

![gem_with_database_git_diff](media/gem_with_database_alpine_changes.png)

To start I changed the image to `ruby:2.5.0-alpine` to use the Ruby Alpine image. Next, I'm using [apk](https://wiki.alpinelinux.org/wiki/Alpine_Linux_package_management) to run `apk --update add --no-cache --virtual run-dependencies`. Let's break down the flags I passed to this command.

`--update`:
Interestingly enough the `--update` flag does not seem to be documented anywhere in the Wiki, but I learned about it from a Gliderlabs' post on [Docker Alpine Usage](http://gliderlabs.viewdocs.io/docker-alpine/usage/). The description they give is **"The --update flag fetches the current package index before adding the package. We don't ship the image with a package index (since that can go stale fairly quickly)."** It appears to be shorthand for doing `apk update && apk add`.

`add`:
This is pretty straight forward. From the [docs](https://wiki.alpinelinux.org/wiki/Alpine_Linux_package_management#Add_a_Package).
**"Use add to install packages from a repository. Any necessary dependencies are also installed. If you have multiple repositories, the add command installs the newest package."**

`--no-cache`:
The `apk --help` description for `--no-cache` is **"--no-cache Do not use any local cache path"**. However, I think the Gliderlabs article did a better job of describing the [functionality](http://gliderlabs.viewdocs.io/docker-alpine/usage/#user-content-disabling-cache).
**"It allows users to install packages with an index that is updated and used on-the-fly and not cached locally."**

`--virtual run-dependencies`: The `apk add --help` description for `--virtual` is **"-t, --virtual NAME Instead of adding all the packages to 'world', create a new virtual package with the listed dependencies and add that to 'world'; the actions of the command are easily reverted by deleting the virtual package."** The Gliderlabs article gives a good example of using `--virtual` to install [build-dependencies](http://gliderlabs.viewdocs.io/docker-alpine/usage/#user-content-virtual-packages) which can then be removed after building the image is complete. We've named our packages `run-dependencies` because they are needed at runtime and should not be removed.

Now lets go through the packages that we add

```
  bash \
  build-base \
  postgresql-client \
  postgresql-dev \
  git
```

[bash](https://pkgs.alpinelinux.org/packages?name=bash&branch=edge) is added so that we can execute our [wait_for_pg.sh](https://github.com/jer-k/gem_with_database/blob/master/bin/wait_for_pg.sh) script when we use the [entry_point](https://github.com/jer-k/gem_with_database/blob/master/docker-compose.yml#L4) in our `docker-compose` file. Also we are able to run a shell inside the container via `docker-compose run app /bin/bash`. This is actually a great way to play around with `apk` if you want to try it out!

[build-base](https://pkgs.alpinelinux.org/packages?name=build-base&branch=edge) adds the applications needed to compile our application for use, like `make` and `gcc`. Below you can see everything that is added.

```
/ # apk add --update build-base
fetch http://dl-cdn.alpinelinux.org/alpine/v3.8/main/x86_64/APKINDEX.tar.gz
fetch http://dl-cdn.alpinelinux.org/alpine/v3.8/community/x86_64/APKINDEX.tar.gz
(1/19) Installing binutils (2.30-r5)
(2/19) Installing libmagic (5.32-r0)
(3/19) Installing file (5.32-r0)
(4/19) Installing gmp (6.1.2-r1)
(5/19) Installing isl (0.18-r0)
(6/19) Installing libgomp (6.4.0-r8)
(7/19) Installing libatomic (6.4.0-r8)
(8/19) Installing pkgconf (1.5.3-r0)
(9/19) Installing libgcc (6.4.0-r8)
(10/19) Installing mpfr3 (3.1.5-r1)
(11/19) Installing mpc1 (1.0.3-r1)
(12/19) Installing libstdc++ (6.4.0-r8)
(13/19) Installing gcc (6.4.0-r8)
(14/19) Installing musl-dev (1.1.19-r10)
(15/19) Installing libc-dev (0.7.1-r0)
(16/19) Installing g++ (6.4.0-r8)
(17/19) Installing make (4.2.1-r2)
(18/19) Installing fortify-headers (0.9-r0)
(19/19) Installing build-base (0.5-r1)
Executing busybox-1.28.4-r1.trigger
OK: 165 MiB in 32 packages
```

[postgresql-client](https://pkgs.alpinelinux.org/packages?name=postgresql-client&branch=edge) is installed for access to `psql`, which we use in [wait_for_pg.sh](https://github.com/jer-k/gem_with_database/blob/master/bin/wait_for_pg.sh#L9) to ensure that the database is ready before we execute the tests.

[postgresql-dev](https://pkgs.alpinelinux.org/packages?name=postgresql-dev&branch=edge) adds the needed libraries to be able to install the `pg` gem.

`git` is used in the autogenerated portion of the gemspec file for the [ls-files](https://github.com/jer-k/gem_with_database/blob/master/gem_with_database.gemspec#L26-L28) command.

Thats it! Lets run our `bin/ci.sh` script and ensure everything is still working.

```
$ bin/ci.sh
db uses an image, skipping
Building app
Step 1/8 : FROM ruby:2.5.0-alpine
2.5.0-alpine: Pulling from library/ruby
ff3a5c916c92: Pull complete
8e2da6035957: Pull complete
41a21a92c054: Pull complete
05eea10525c0: Pull complete
Digest: sha256:1d35d83403ab30d3f6d93df194fd830286e0f26d8d26e2748d46f6307c40d7e7
Status: Downloaded newer image for ruby:2.5.0-alpine
 ---> 8ea9c590ec75
Step 2/8 : WORKDIR /usr/src/app/
 ---> Running in 16425d48de04
Removing intermediate container 16425d48de04
 ---> 3408f8d0931d
Step 3/8 : RUN apk --update add --no-cache --virtual run-dependencies   bash   build-base   postgresql-client   postgresql-dev   git
 ---> Running in 60c705e777f1
fetch http://dl-cdn.alpinelinux.org/alpine/v3.7/main/x86_64/APKINDEX.tar.gz
fetch http://dl-cdn.alpinelinux.org/alpine/v3.7/main/x86_64/APKINDEX.tar.gz
fetch http://dl-cdn.alpinelinux.org/alpine/v3.7/community/x86_64/APKINDEX.tar.gz
fetch http://dl-cdn.alpinelinux.org/alpine/v3.7/community/x86_64/APKINDEX.tar.gz
(1/32) Installing bash (4.4.19-r1)
Executing bash-4.4.19-r1.post-install
(2/32) Installing binutils-libs (2.30-r1)
(3/32) Installing binutils (2.30-r1)
(4/32) Installing gmp (6.1.2-r1)
(5/32) Installing isl (0.18-r0)
(6/32) Installing libgomp (6.4.0-r5)
(7/32) Installing libatomic (6.4.0-r5)
(8/32) Installing libgcc (6.4.0-r5)
(9/32) Installing mpfr3 (3.1.5-r1)
(10/32) Installing mpc1 (1.0.3-r1)
(11/32) Installing libstdc++ (6.4.0-r5)
(12/32) Installing gcc (6.4.0-r5)
(13/32) Installing musl-dev (1.1.18-r3)
(14/32) Installing libc-dev (0.7.1-r0)
(15/32) Installing g++ (6.4.0-r5)
(16/32) Installing make (4.2.1-r0)
(17/32) Installing fortify-headers (0.9-r0)
(18/32) Installing build-base (0.5-r0)
(19/32) Installing libedit (20170329.3.1-r3)
(20/32) Installing db (5.3.28-r0)
(21/32) Installing libsasl (2.1.26-r11)
(22/32) Installing libldap (2.4.45-r3)
(23/32) Installing libpq (10.5-r0)
(24/32) Installing postgresql-client (10.5-r0)
(25/32) Installing postgresql-libs (10.5-r0)
(26/32) Installing postgresql-dev (10.5-r0)
(27/32) Installing libssh2 (1.8.0-r2)
(28/32) Installing libcurl (7.61.1-r0)
(29/32) Installing expat (2.2.5-r0)
(30/32) Installing pcre2 (10.30-r0)
(31/32) Installing git (2.15.2-r0)
(32/32) Installing run-dependencies (0)
Executing busybox-1.27.2-r7.trigger
OK: 214 MiB in 62 packages
Removing intermediate container 60c705e777f1
 ---> f6c061c7c941
Step 4/8 : COPY gem_with_database.gemspec .
 ---> dcf566413659
Step 5/8 : COPY Gemfile .
 ---> 7c570a109e4c
Step 6/8 : COPY lib/gem_with_database/version.rb lib/gem_with_database/
 ---> 7940e94550a3
Step 7/8 : RUN bundle check || bundle install
 ---> Running in 6b1073edf7cb
fatal: Not a git repository (or any of the parent directories): .git
Bundler can't satisfy your Gemfile's dependencies.
Install missing gems with `bundle install`.
fatal: Not a git repository (or any of the parent directories): .git
Fetching gem metadata from https://rubygems.org/........
Fetching gem metadata from https://rubygems.org/.
Resolving dependencies...
Fetching rake 10.5.0
Installing rake 10.5.0
Fetching concurrent-ruby 1.0.5
Installing concurrent-ruby 1.0.5
Fetching i18n 0.9.5
Installing i18n 0.9.5
Fetching minitest 5.11.3
Installing minitest 5.11.3
Fetching thread_safe 0.3.6
Installing thread_safe 0.3.6
Fetching tzinfo 1.2.5
Installing tzinfo 1.2.5
Fetching activesupport 5.1.5
Installing activesupport 5.1.5
Fetching builder 3.2.3
Installing builder 3.2.3
Fetching erubi 1.7.1
Installing erubi 1.7.1
Fetching mini_portile2 2.3.0
Installing mini_portile2 2.3.0
Fetching nokogiri 1.8.4
Installing nokogiri 1.8.4 with native extensions
Fetching rails-dom-testing 2.0.3
Installing rails-dom-testing 2.0.3
Fetching crass 1.0.4
Installing crass 1.0.4
Fetching loofah 2.2.2
Installing loofah 2.2.2
Fetching rails-html-sanitizer 1.0.4
Installing rails-html-sanitizer 1.0.4
Fetching actionview 5.1.5
Installing actionview 5.1.5
Fetching rack 2.0.5
Installing rack 2.0.5
Fetching rack-test 1.1.0
Installing rack-test 1.1.0
Fetching actionpack 5.1.5
Installing actionpack 5.1.5
Fetching activemodel 5.1.5
Installing activemodel 5.1.5
Fetching arel 8.0.0
Installing arel 8.0.0
Fetching activerecord 5.1.5
Installing activerecord 5.1.5
Using bundler 1.16.1
Fetching coderay 1.1.2
Installing coderay 1.1.2
Fetching diff-lcs 1.3
Installing diff-lcs 1.3
Fetching dotenv 2.2.1
Installing dotenv 2.2.1
Fetching factory_bot 4.8.2
Installing factory_bot 4.8.2
Using gem_with_database 0.1.0 from source at `.`
Fetching method_source 0.9.0
Installing method_source 0.9.0
Fetching pg 0.21.0
Installing pg 0.21.0 with native extensions
Fetching pry 0.11.3
Installing pry 0.11.3
Fetching thor 0.20.0
Installing thor 0.20.0
Fetching railties 5.1.5
Installing railties 5.1.5
Fetching rspec-support 3.7.0
Installing rspec-support 3.7.0
Fetching rspec-core 3.7.0
Installing rspec-core 3.7.0
Fetching rspec-expectations 3.7.0
Installing rspec-expectations 3.7.0
Fetching rspec-mocks 3.7.0
Installing rspec-mocks 3.7.0
Fetching rspec 3.7.0
Installing rspec 3.7.0
Bundle complete! 12 Gemfile dependencies, 38 gems now installed.
Bundled gems are installed into `/usr/local/bundle`
Removing intermediate container 6b1073edf7cb
 ---> e745d22f5fd0
Step 8/8 : COPY . .
 ---> 47a95a0fcb2e
Successfully built 47a95a0fcb2e
Successfully tagged gem_with_database_app:latest
Starting gem_with_database_db_1 ... done
                                       List of databases
          Name          |  Owner   | Encoding |  Collate   |   Ctype    |   Access privileges
------------------------+----------+----------+------------+------------+-----------------------
 gem_with_database_test | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
 postgres               | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
 template0              | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
                        |          |          |            |            | postgres=CTc/postgres
 template1              | postgres | UTF8     | en_US.utf8 | en_US.utf8 | =c/postgres          +
                        |          |          |            |            | postgres=CTc/postgres
(4 rows)

Postgres is up - executing command
/usr/local/bin/ruby -I/usr/local/bundle/gems/rspec-core-3.7.0/lib:/usr/local/bundle/gems/rspec-support-3.7.0/lib /usr/local/bundle/gems/rspec-core-3.7.0/exe/rspec --pattern spec/\*\*\{,/\*/\*\*\}/\*_spec.rb
Dropped database 'gem_with_database_test'
Created database 'gem_with_database_test'
-- enable_extension("plpgsql")
   -> 0.0184s
-- create_table("authors", {:force=>:cascade})
   -> 0.0271s
-- create_table("books", {:force=>:cascade})
   -> 0.0114s
-- add_foreign_key("books", "authors")
   -> 0.0041s

GemWithDatabase
  has a version number

GemWithDatabase::Author
  is a test author

Finished in 0.02154 seconds (files took 1.27 seconds to load)
2 examples, 0 failures
```

A final note: Gliderlabs maintain the [Docker Alpine image](https://github.com/gliderlabs/docker-alpine) on Github if you're interested in looking the source code!
