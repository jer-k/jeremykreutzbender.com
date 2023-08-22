---
title: Adding a Test Environment to the Active Record Rake Tasks Gem
date: "2018-03-12"
template: "post"
draft: false
slug: "testing-and-developer-scripts-for-active-record-gem"
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
  - "test"
  - "testing"
  - "rspec"
description: "Set up a testing environment that can be run locally and in a repeatable fashion for continuous integration"
socialImage: 
---

Continuing to work on our [gem with active_record rake tasks](https://jer-k.github.io/add-active-record-rake-tasks-to-gem/), we still need to set up a testing environment that can be run locally and in a repeatable fashion for continuous integration; we'll accomplish the latter using a simple Dockerfile. But first let's make it easier for someone to start using the gem by enhancing the scripts in `bin/`.

We'll start off by changing `bin/setup` to create the user and the database.
```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'
set -vx

bundle install

psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='gem_with_database'" | grep -q 1 || \
psql -c "create role gem_with_database with superuser login password 'password'"

psql -tAc "SELECT 1 FROM pg_database WHERE datname='gem_with_database_development'" | grep -q 1 || \
rake db:create db:migrate db:seed
```
The first command queries the `pg_roles` table looking to see if there is a role named `gem_with_database` and returns 1 if so. The result is piped into `grep` looking for the 1, if it is found we stop, otherwise we issue another command to create the `gem_with_database` role. If you're curious as to how this works, `grep` returns a non-zero exit code if it doesn't find something and a bash `||` only evaluates the right-hand side of the expression if the left-hand side has a non-zero value.
We follow the same pattern in the second command and look to see if a database named `gem_with_database_development` exists; if it doesn't we create it and add our data.

Once the database is created and has data in it, we want to start playing around with our models and we can ensure everything is ready by modifying `bin/console`.

```ruby
#!/usr/bin/env ruby

require 'bundler/setup'
require 'gem_with_database'
require 'active_record'
require 'logger'
require 'pry'

ActiveRecord::Base.establish_connection(
  :adapter => 'postgresql',
  :database => 'gem_with_database_development'
)
ActiveRecord::Base.logger = Logger.new(STDOUT)

Pry.start
```
We simply require the needed gems to establish a connection to the database, setup logging so we can see the results of the queries, and my personal preference is to use a `Pry` console. With that a user can clone the repository, run `bin/setup` and then `bin/console` and be able to query data!
```ruby
[1] pry(main)> GemWithDatabase::Book.first
D, [2018-03-10T17:49:22.051607 #31929] DEBUG -- :   GemWithDatabase::Book Load (4.5ms)  SELECT  "books".* FROM "books" ORDER BY "books"."id" ASC LIMIT $1  [["LIMIT", 1]]
=> #<GemWithDatabase::Book:0x00007f8e9cdf6e70
 id: 1,
 title: "A Game of Thrones",
 pages: 694,
 published: 1996,
 author_id: 1>
```

Now that we have everyone up and running with a development environment, we need to setup our testing environment. The first thing we will do is add [FactoryBot](https://github.com/thoughtbot/factory_bot) so we can create mock data.

```ruby
spec.add_dependency 'factory_bot', `~> 4`
```

It is added as a normal dependency because we can actually export our factories so that anyone who uses the gem gets an added bonus of being able to create mock data right off the bat, instead of having to define their own.

We'll create `lib/gem_with_database/factories/author.rb`.

```ruby
require 'factory_bot'

FactoryBot.define do
  factory :gem_with_database_author, class: GemWithDatabase::Author do
    name 'Test Author'
    age 1
  end
end
```
The name of the factory is prefixed with the name of the gem to ensure that we aren't going to create a collision if someone has already defined a factory named `book` in their application. Now we need to expose the factory in `lib/gem_with_database.rb` and we can move onto setting up our test database.
```
require 'gem_with_database/factories/author'
```

We'll modify `spec/spec_helper.rb` to create a database in the test environment for us to use.
```ruby
ENV['ENV'] = 'test' # Ensure we don't drop the development database

require 'bundler/gem_tasks'
require_relative '../support/active_record_rake_tasks'
task :environment

Rake::Task['db:drop'].invoke
Rake::Task['db:create'].invoke
Rake::Task['db:schema:load'].invoke
```

First and foremost we need to set the `ENV` to `test` to ensure that we're targeting only the test database; remember we set up the `DatabaseTasks.env` to read from `ENV['ENV']`. Then we load the needed files to invoke our rake tasks, stub out the `task :environment` like we did in the `Rakefile`, and create a new database with our schema. Let's write a test for our `Author` class at `spec/models/author_spec.rb` and try it out.

```ruby
require 'spec_helper'

RSpec.describe GemWithDatabase::Author do
  it 'is a test author' do
    author = FactoryBot.create(:gem_with_database_author)
    expect(author.name).to eq('Test Author')
  end
end
```

```bash
$ rspec
Dropped database 'gem_with_database_test'
Created database 'gem_with_database_test'
-- enable_extension("plpgsql")
   -> 0.0392s
-- create_table("authors", {:force=>:cascade})
   -> 0.0093s
-- create_table("books", {:force=>:cascade})
   -> 0.0112s
-- add_foreign_key("books", "authors")
   -> 0.0209s

GemWithDatabase
  has a version number

GemWithDatabase::Author
  is a test author

Finished in 0.02844 seconds (files took 2.13 seconds to load)
2 examples, 0 failures
```

Success! We've created a re-usable database for the test environment and our tests are passing. The last thing we want to do is setup a way to run our tests in a continuous integration environment so that when the popularity of the gem has exploded and the number of contributors skyrockets, we're able to ensure no one is committing broken code. We'll do this by creating a `Dockerfile`, utilizing [Docker Compose](https://docs.docker.com/compose/), and a few helpful scripts. However, please bear with me, I am by no means an expert with Docker; I've was able to fumble my way through this and get it working so if my explanations aren't as thorough I apologize.

First, the [Dockerfile](https://github.com/jer-k/gem_with_database/blob/old_dockerfile/Dockerfile).
```
FROM ruby:2.5
WORKDIR /usr/src/app/

#Copy the gem files into the WORKDIR
COPY gem_with_database.gemspec .
COPY Gemfile .
COPY lib/gem_with_database/version.rb lib/gem_with_database/

RUN bundle check || bundle install

# Install psql so bin/wait_for_pg.sh will wait for the database to be up and running
# Get the Key
RUN wget --quiet https://www.postgresql.org/media/keys/ACCC4CF8.asc
RUN apt-key add ACCC4CF8.asc

# Add the Source List
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" > /etc/apt/sources.list.d/pgdg.list

# Update and Install
RUN apt-get update && apt-get -y install postgresql-client-9.6

#Copy the project into the WORKDIR
COPY . .
```
The `ruby:2.5` image as it is the latest as of writing so we'll use that and we set the `WORKDIR` to `/usr/src/app`. Next we copy in the `.gemspec` file, the `Gemfile`, and the `version.rb` because it is referenced in the `.gemspec`. Then we run `bundle check || bundle install` which will check to see if we need to run `bundle install` or not, hopefully saving time and not requiring a full install of all the gems each time we use the container. Next, I want to install `postgresl-client` so that we have access to `psql` and can run the `wait_for_pg.sh` script below. I slightly modified the Docker instructions for installing [Postgresql](https://docs.docker.com/engine/examples/postgresql_service/). Finally, we copy in the entire contents of the gem.

The `docker-compose.yml` adds the [entrypoint](https://docs.docker.com/compose/compose-file/compose-file-v2/#entrypoint) which takes in a parameter, the name of the postgres database we defined, `db`. Otherwise we add the environment variables for postgres and builds the image.
```yaml
version: '2'
services:
  app:
    entrypoint: ./bin/wait_for_pg.sh db
    build: .
    volumes:
      - .:/app
    environment:
      POSTGRES_HOST: db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ''
    depends_on:
      - db
  db:
    image: postgres
    ports:
      - "5432"
```

We'll create a `bin/wait_for_pg.sh` script, which the code was taken from the [Control startup order in Compose](https://docs.docker.com/compose/startup-order/) page.
```bash
#!/bin/bash

set -e

host="$1"
shift
cmd="$@"

until psql -h "$host" -U "postgres" -c '\l'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd
```

One last script to run our tests which will be `bin/ci.sh`.
```bash
#!/bin/bash -e

docker-compose build --pull
docker-compose run \
  -e "RAILS_ENV=test" \
  app bundle exec rake spec
```

We tell `docker-compose` to `build` our image and pass `--pull` to ensure it always pulls the most up to date base image. Then we tell `docker-compose` to `run` `app bundle exec rake spec`, using `-e` to pass an environment variable of `RAILS_ENV=test`. We can now run `bin/ci.sh` and we should see Docker build everything and run our tests!

```bash
$ bin/ci.sh
db uses an image, skipping
Building app
Step 1/11 : FROM ruby:2.5
2.5: Pulling from library/ruby
Digest: sha256:ed5fc221d5d03d89e1f8c1f7780b98bc708e68b4d8dba73594d017e999156619
Status: Image is up to date for ruby:2.5
 ---> bae0455cb2b9
Step 2/11 : WORKDIR /usr/src/app/
 ---> Using cache
 ---> 6f3c5f15ac42
Step 3/11 : COPY gem_with_database.gemspec .
 ---> Using cache
 ---> eb3ecc2ee4cf
Step 4/11 : COPY Gemfile .
 ---> Using cache
 ---> cc6f4fb53b10
Step 5/11 : COPY lib/gem_with_database/version.rb lib/gem_with_database/
 ---> Using cache
 ---> 687de04b34df
Step 6/11 : RUN bundle check || bundle install
 ---> Using cache
 ---> bc457854c58b
Step 7/11 : RUN wget --quiet https://www.postgresql.org/media/keys/ACCC4CF8.asc
 ---> Using cache
 ---> 889e0f4155b1
Step 8/11 : RUN apt-key add ACCC4CF8.asc
 ---> Using cache
 ---> 9c312fe432e9
Step 9/11 : RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ precise-pgdg main" > /etc/apt/sources.list.d/pgdg.list
 ---> Using cache
 ---> 2cc90fde777c
Step 10/11 : RUN apt-get update && apt-get -y install postgresql-client-9.6
 ---> Using cache
 ---> b50c64265bb8
Step 11/11 : COPY . .
 ---> 647917bd7233
Successfully built 647917bd7233
Successfully tagged gemwithdatabase_app:latest
Starting gemwithdatabase_db_1 ... done
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
   -> 0.0256s
-- create_table("authors", {:force=>:cascade})
   -> 0.0503s
-- create_table("books", {:force=>:cascade})
   -> 0.0251s
-- add_foreign_key("books", "authors")
   -> 0.0120s

GemWithDatabase
  has a version number

GemWithDatabase::Author
  is a test author

Finished in 0.03851 seconds (files took 2.74 seconds to load)
2 examples, 0 failures
```

We've successfully created our testing environment and got it running in Docker (I did run into some issues with needing to add specific versions of gems.) Hopefully this provides a good blueprint to follow for the next gem you create that might need access to a database and a testing environment.
