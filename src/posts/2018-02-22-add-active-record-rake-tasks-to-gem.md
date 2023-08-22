---
title: Adding ActiveRecord Rake Tasks to a Gem
date: "2018-02-22"
template: "post"
draft: false
slug: "add-active-record-rake-tasks-to-gem"
category: "Programming"
tags:
  - "ruby"
  - "rails"
  - "ruby-gems"
  - "ruby-on-rails"
  - "postgres"
  - "postgresql"
  - "database"
  - "active-record"
  - "rake"
description: "Instead of having to create a Rails application and install the gem to connect to the database to test your models, we can create local database for only the gem by adding ActiveRecord's Rake tasks."
socialImage: 
---

In my previous [post](https://jer-k.github.io/connect-to-database-through-gem/) I walked through using a gem to connect to another Rails application's database, but another use case for connecting a gem to a database is for the development of the gem itself. Instead of having to create a Rails application and install the gem to connect to the database to test your models, we can create local database for only the gem by adding ActiveRecord's Rake tasks.

There will be a lot to go through so I'm going to break this down into two parts: the first being creating the gem and enabling the usage of familiar tasks such as `db:create` and `db:migrate`, the second being setting up the testing environment locally and with Docker for CI purposes.

Let's get started creating the gem!

```ruby
bundler gem gem_with_data
```

First thing we need to do is add the dependencies to `gem_with_data.gemspec`.

```ruby
spec.add_dependency 'activerecord', '~> 5'

spec.add_development_dependency "bundler", "~> 1.15"
spec.add_development_dependency "rake", "~> 10.0"
spec.add_development_dependency "rspec", "~> 3.0"
spec.add_development_dependency 'pg', '~> 0.19'
spec.add_development_dependency 'pry', '~> 0.10'
spec.add_development_dependency 'dotenv', '~> 2.2'
spec.add_development_dependency 'railties', '~> 5'
```

Knowing that we're going to need to configure the database, we'll go ahead and create `config/database.yml` and `.env` to allow flexibility in the configuration.
```ruby
default: &default
  adapter: postgresql
  encoding: unicode
  pool: 5
  host: localhost
  port: 5432

local: &local
  host: <%= ENV['POSTGRES_HOST'] %>
  username: <%= ENV['POSTGRES_USER'] %>
  password: <%= ENV['POSTGRES_PASSWORD'] %>

development:
  <<: *default
  <<: *local
  database: gem_with_database_development

test:
  <<: *default
  <<: *local
  database: gem_with_database_test
```

```ruby
POSTGRES_USER=gem_with_database
POSTGRES_PASSWORD=password
```

Ensure the user the database expects has been created.
```bash
$ psql postgres --command="create role gem_with_database with superuser login password 'password'"
```

Now we can create `support/active_record_rake_tasks.rb` to configure `ActiveRecord::Tasks::DatabaseTasks` and load the rake tasks.

```ruby
# Add the ability to run db:create/migrate/drop etc
require 'yaml'
require 'erb'
require 'dotenv'
require 'active_record'
include ActiveRecord::Tasks

root = File.expand_path('../..', __FILE__)
DatabaseTasks.root = root
DatabaseTasks.db_dir = File.join(root, 'db')
DatabaseTasks.migrations_paths = [File.join(root, 'db/migrate')]

# Load the environment variables for the Postgres user
Dotenv.load('.env')
DatabaseTasks.database_configuration = YAML.load(ERB.new(IO.read(File.join(root, 'config/database.yml'))).result)

# The SeedLoader is Optional, if you don't want/need seeds you can skip setting it
class SeedLoader
  def initialize(seed_file)
    @seed_file = seed_file
  end

  def load_seed
    load @seed_file if File.exist?(@seed_file)
  end
end

DatabaseTasks.seed_loader = SeederLoader.new(File.join(root, 'db/seeds.rb'))

DatabaseTasks.env = ENV['ENV'] || 'development'

ActiveRecord::Base.configurations = DatabaseTasks.database_configuration
ActiveRecord::Base.establish_connection(DatabaseTasks.env.to_sym)

load 'active_record/railties/databases.rake'
```

Let's walk through what we've done and then we'll try it out! By including `ActiveRecord::Tasks` we are able to start configuring [ActiveRecord::Tasks::DatabaseTasks](https://github.com/rails/rails/blob/5e4b70461dfd869c7d96b2528e666a9dd8e29183/activerecord/lib/active_record/tasks/database_tasks.rb). Looking at the [attr_writer](https://github.com/rails/rails/blob/5e4b70461dfd869c7d96b2528e666a9dd8e29183/activerecord/lib/active_record/tasks/database_tasks.rb#L50) properties in `DatabaseTasks` we can get a feel for the properties we need to set.

```ruby
attr_writer :current_config, :db_dir, :migrations_paths, :fixtures_path, :root, :env, :seed_loader
```

First, we'll set `root` to the base directory of the gem, this mimics the effects of `Rails.root`, which coincidentally is exactly what the [DatabaseTasks#root](https://github.com/rails/rails/blob/5e4b70461dfd869c7d96b2528e666a9dd8e29183/activerecord/lib/active_record/tasks/database_tasks.rb#L96-L98) method calls. Next, we need to set the `db_dir` and we'll do so by mimicking the structure of a Rails project and having the directory be named `db` and live under the root. Continuing to have our setup look like a Rails project we'll create the `db/migrate` directory and set it as the `migrations_paths`; note that its plural so we pass in an `Array` and could specify more than one directory. 
We'll load the environment variables needed for the `database_configuration` and then make use of `YAML` and `ERB` to interpret the `database.yml` file. The next step is optional, but if we want to be able to use seeds, we have to define a class that responds to [load_seed](https://github.com/rails/rails/blob/5e4b70461dfd869c7d96b2528e666a9dd8e29183/activerecord/lib/active_record/tasks/database_tasks.rb#L281). 
Following the invocation in `DatabaseTasks` we can see the method definition for [load_seed](https://github.com/rails/rails/blob/6a728491b66340345a91264b5983ad81944ab97a/railties/lib/rails/engine.rb#L549-L552).

```ruby
def load_seed
  seed_file = paths["db/seeds.rb"].existent.first
  load(seed_file) if seed_file
end
```

Our `SeedLoader` class will be initialized referencing to a file, which will be `db/seeds.rb` just as in a Rails project. In preparation for running the tests later we'll default the `environment` to `development` unless otherwise specified. The last three things we need to do are set the `ActiveRecord::Base.configurations` to our configured `DatabaseTasks.database_configuration`, use `establish_connection` to the database using the environment we specified, and then load [active_record/railties/databases.rake](https://github.com/rails/rails/blob/6a728491b66340345a91264b5983ad81944ab97a/activerecord/lib/active_record/railties/databases.rake) to make the Rake tasks available.

Now we need to load our `active_record_rake_tasks.rb` file in `Rakefile`.

```ruby
require './support/active_record_rake_tasks'
# Stub the :environment task for tasks like db:migrate & db:seed. Since this is a Gem we've explicitly required all
# dependent files in the needed places and we don't have to load the entire environment.
task :environment
```
I stubbed out the `task :environment` because some tasks like [db:migrate](https://github.com/rails/rails/blob/6a728491b66340345a91264b5983ad81944ab97a/activerecord/lib/active_record/railties/databases.rake#L59-L62) explicitly require `:environment` to be defined.
```ruby
task migrate: [:environment, :load_config] do
  ActiveRecord::Tasks::DatabaseTasks.migrate
  db_namespace["_dump"].invoke
end
```

Let's see if it works...

```bash
$ rake db:create
Created database 'gem_with_database_development'
Created database 'gem_with_database_test'

$ rake db:migrate

$ rake db:drop
Dropped database 'gem_with_database_development'
Dropped database 'gem_with_database_test'
```

I was able to run `rake db:migrate` but we don't actually have any migrations; unfortunately `rails generate` is not available to us yet! 

```bash
$ rails g migration create_author name:string age:integer
Usage:
  rails new APP_PATH [options]
```

This result is due to the fact that I have the Rails gem globally installed so that I can create new Rails applications in any directory. However, I don't want to bring the entirety of Rails into the gem so we're going to have to add this ability ourselves. We'll create `exe/gem_rails` to mimic the pattern used when creating a gem with a CLI.

```ruby
#!/usr/bin/env ruby

require 'rails'

module GemWithDatabase
  class Engine < Rails::Engine
    config.generators do |g|
      g.orm :active_record
    end
  end
end

Rails.application = GemWithDatabase::Engine

require 'rails/commands'
```

The code required to get this running is a lot less than I expected and for the sake of brevity I'll just through what the code is doing (I do however want to write about the process of figuring all this out. I'll follow this post with that information. [Follow up here](https://jer-k.github.io/adding-rails-g-migration-to-a-gem/)).

The `require rails` is not actually requiring all of Rails (as I mentioned I didn't want to do above) but only the [Rails module](https://github.com/rails/rails/blob/6a728491b66340345a91264b5983ad81944ab97a/railties/lib/rails.rb) defined in `Railties`. This gives us access to [Rails::Engine](https://github.com/rails/rails/blob/6a728491b66340345a91264b5983ad81944ab97a/railties/lib/rails/engine.rb), which we need to create our own. `Rails::Engine` in a subclass of [Rails::Railtie](https://github.com/rails/rails/blob/6a728491b66340345a91264b5983ad81944ab97a/railties/lib/rails/railtie.rb) which has a [generators](https://github.com/rails/rails/blob/6a728491b66340345a91264b5983ad81944ab97a/railties/lib/rails/railtie.rb#L151-L153) method.

```ruby
def generators(&blk)
  register_block_for(:generators, &blk)
end
```

By registering `g.orm :active_record`, when our engine runs [load_generators](https://github.com/rails/rails/blob/6a728491b66340345a91264b5983ad81944ab97a/railties/lib/rails/engine.rb#L465-L470) 
```ruby
def load_generators(app = self)
  require "rails/generators"
  run_generators_blocks(app)
  Rails::Generators.configure!(app.config.generators)
  self
end
```
it properly adds [active_record:migration](https://github.com/rails/rails/blob/6a728491b66340345a91264b5983ad81944ab97a/railties/lib/rails/generators.rb#L153-L154) to our accessible generators. Now we can try to generate the migration again. Don't forget make the file executable `$ chmod 755 exe/gem_rails`.

```bash
$ exe/gem_rails g migration create_author name:string age:integer
      invoke  active_record
      create    db/migrate/20180228040040_create_author.rb
```

Success! Let's look at the migration that was created and then migrate our database.

```ruby
class CreateAuthor < ActiveRecord::Migration[5.1]
  def change
    create_table :authors do |t|
      t.string :name
      t.integer :age
    end
  end
end
```
```bash
$ rake db:migrate
== 20180228040040 CreateAuthor: migrating =====================================
-- create_table(:authors)
   -> 0.0308s
== 20180228040040 CreateAuthor: migrated (0.0309s) ============================
```

Awesome! I'll wrap up by seeding my database and then query for some data. To accomplish this I'll create the models, create a migration for books, and the query the data.

```bash
$ exe/gem_rails g migration create_books title:string pages:integer published:integer author:references
      invoke  active_record
      create    db/migrate/20180228040533_create_books.rb
$ rake db:migrate
== 20180228040533 CreateBooks: migrating ======================================
-- create_table(:books)
   -> 0.0494s
== 20180228040533 CreateBooks: migrated (0.0495s) =============================
$ rake db:seed
```
```ruby
$ bin/console
2.5.0 :001 > require 'active_record'
 => false 
2.5.0 :002 > ActiveRecord::Base.establish_connection(
2.5.0 :003 >       :adapter => 'postgresql',
2.5.0 :004 >       :database => 'gem_with_database_development'
2.5.0 :005?>   )
2.5.0 :006 > GemWithDatabase::Author.find_by(name: 'J.K. Rowling')
 => #<GemWithDatabase::Author id: 2, name: "J.K. Rowling", age: 50> 
```

We've successfully added all the ActiveRecord Rake tasks to our gem and have been able to create, migrate, seed, and query our database! There is a [repository](https://github.com/jer-k/gem_with_database) for I work I did while writing this post. Feel free to try it out and be on the lookout for some follow up posts. I'll be writing in more detail about the how I figured out what was needed for the `Rails::Engine`(post [here](https://jer-k.github.io/adding-rails-g-migration-to-a-gem/)) and then I'll continue working on this project setting up the testing environment locally and then using Docker for CI purposes, along with a few enhancements to the scripts in `bin/`.
