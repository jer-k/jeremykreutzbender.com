---
title: Connect To Another Rails Application's Database Through A Gem
date: "2018-02-18"
template: "post"
draft: false
slug: "connect-to-database-through-gem"
category: "Programming"
tags:
  - "ruby"
  - "rails"
  - "ruby-gems"
  - "ruby-on-rails"
  - "postgres"
  - "postgresql"
  - "database"
description: "I was recently thinking about system design, specifically the monolithic vs microservices approaches and how applications can talk to each other."
socialImage: 
---

I was recently thinking about system design, specifically the monolithic vs microservices approaches and how applications can talk to each other. If I needed to connect two applications, I would start by exposing APIs and using [Faraday](https://github.com/lostisland/faraday) to write a simple HTTP client to consume the APIs. However, APIs can have their own set of issues (a discussion for another day) and an idea popped into my head to allow applications to connect directly to the database of another application through a gem that exposes the classes. I would only consider this approach internal applications and even then, you could totally cripple your system if someone starts writing queries without knowing what they are doing. But I was curious and wanted to try this approach out so let's get started with creating our gem!

```ruby
bundle gem books_gem
```

We’ll need to add ActiveRecord as a dependency to the `books_gem.gemspec`.

```ruby
 spec.add_dependency 'activerecord', '~> 5'
```

Next, create a base class at `lib/books_gem/models/base.rb`
```ruby
require 'active_record'
require 'books_gem/db/books_gem_db'

module BooksGem
  class Base < ::ActiveRecord::Base
    self.abstract_class = true
    establish_connection(BOOKS_GEM_DB[Rails.env])
  end
end
```

and a few subclasses.
```ruby
require 'books_gem/models/base'

module BooksGem
  class Book < Base
  end
end
```
```ruby
require 'books_gem/models/base'

module BooksGem
  class Author < Base
  end
end
```

The [establish_connection](http://api.rubyonrails.org/classes/ActiveRecord/ConnectionHandling.html#method-i-establish_connection) call allows us to tell `ActiveRecord` how, and where, we're going to connect to a database. Since this is our base class, the connection will only be established once, and all our subclasses will know where their database resides. If you would like to read more about why you should only establish a single connection, Sophie DeBenedetto wrote a great blog post, [Managing Multiple Databases in a Single Rails Application](http://www.thegreatcodeadventure.com/managing-multiple-databases-in-a-single-rails-application/), going much further in depth on that topic; kudos to her, she provided much of the inspiration for my work on this idea.

Since this is a gem, we want our connection to be configurable for anyone who uses it. The `BOOKS_GEM_DB` constant will provide this configurability, which we'll create at `lib/books_gem/db/books_gem_db.rb`.
```ruby
require 'yaml'
require 'erb'

db_dir = File.expand_path('../', __FILE__)
BOOKS_GEM_DB = YAML.load(ERB.new(IO.read(File.join(db_dir, 'books_gem_database.yml'))).result)
```

The YAML file will be located at `lib/books_gem/db/books_gem_database.yml`.
```yaml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: 5
  port: 5432

local: &local
  host: <%= ENV['BOOKS_GEM_DB_HOST'] %>
  username: <%= ENV['BOOKS_GEM_DB_USER'] %>
  password: <%= ENV['BOOKS_GEM_DB_PASSWORD'] %>

development:
  <<: *default
  <<: *local
  database: <%= ENV['BOOKS_GEM_DB_DEVELOPMENT'] %>

test:
  <<: *default
  <<: *local
  database: <%= ENV['BOOKS_GEM_DB_TEST'] %>
```
What we're doing here is getting the full file path for the `lib/books_gem/db` directory based off the location of `books_gem_db.rb` file. We use that file path to open the `books_gem_database.yml` file and read its contents into an ERB object. As you saw above, we're using ERB templating in the YAML file to read environment variables that tell us where the database resides and how to connect to it. Finally, we load the YAML and save it into the `BOOKS_GEM_DB` constant.

The last thing we need to do is expose all our classes in `lib/books_gem.rb` so that applications who install the gem can use them.
```ruby
require "books_gem/version"

require 'books_gem/models/book'
require 'books_gem/models/author'
```

That concludes writing the gem. There is an example project located at [https://github.com/jer-k/api_to_gem](https://github.com/jer-k/api_to_gem) with instructions in the [README](https://github.com/jer-k/api_to_gem/blob/master/README.md) on how to test out the gem. There is one last gotcha, which is ensuring that the environment variables from the Rails application are available when the gem loads. I prefer to use [Dotenv](https://github.com/bkeepers/dotenv) and we would install it using the `rails-now` preference
```ruby
gem 'dotenv-rails', require: 'dotenv/rails-now'
gem 'books_gem', path: path/to/books_gem
```

Then we can set our environment variables in the Rails application and be done.
```ruby
BOOKS_GEM_DB_HOST=localhost
BOOKS_GEM_DB_USER=books_user
BOOKS_GEM_DB_PASSWORD=books
BOOKS_GEM_DB_DEVELOPMENT=books_api_development
BOOKS_GEM_DB_TEST=books_api_test
```

We've successfully connected from one Rails application to another Rails application's database and are free to write queries to our hearts content!
