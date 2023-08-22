---
title: Adding Rails G Migration To a Gem - Following Code To Re-Implement Functionality
date: "2018-02-25"
template: "post"
draft: false
slug: "adding-rails-g-migration-to-a-gem"
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
description: "The process I went through to figure out what was needed; I believe it is good exercise in understanding how to follow code to and understanding what it takes to re-implement functionality."
socialImage: 
---

This is a follow up to my last post about [Adding ActiveRecord Rake Tasks to a Gem](https://jer-k.github.io/add-active-record-rake-tasks-to-gem/) that I promised to write. In that post I had to figure out how to make the command `rails g migration` accessible inside of the gem, which ended up taking me all afternoon, but surprised me in how little code was actually needed to achieve the result. I wanted to write about the process I went through to figure out what was needed; I believe it is good exercise in understanding how to follow code to and understanding what it takes to re-implement functionality.

A note before I begin: I use [RubyMine](https://www.jetbrains.com/ruby/) for my IDE and all of the tracing of the code I did in RubyMine, unless otherwise stated. I'm going to provide links to Github so you can see exactly where I saw the code I'm talking about. I also picked the most current commit as of writing for the links to ensure they continue pointing at the correct code.

When I first realized that `rails g migration` wasn't available in the gem I thought to myself, well that makes a lot of sense, I haven't included Rails. But I was almost fooled by the globally installed Rails for a moment!

```bash
$ rails
Usage:
  rails new APP_PATH [options]
```
That output is indicating that I have installed Rails globally and I can create a new Rails application in any directory I want. The output that I was looking for is the output when running `rails` inside of a Rails application.

```bash
$ rails
The most common rails commands are:
 generate     Generate new code (short-cut alias: "g")
 console      Start the Rails console (short-cut alias: "c")
 server       Start the Rails server (short-cut alias: "s")
 test         Run tests except system tests (short-cut alias: "t")
 test:system  Run system tests
 dbconsole    Start a console for the database specified in config/database.yml
              (short-cut alias: "db")

 new          Create a new Rails application. "rails new my_app" creates a
              new application called MyApp in "./my_app"


All commands can be run with -h (or --help) for more information.
```
Seeing this result, the easiest thing that came to mind was to figure out where the line `The most common rails commands are` lives and start my work there. Going to the [Rails](https://github.com/rails/rails) repo on Github and [searching](https://github.com/rails/rails/search?utf8=%E2%9C%93&q=The+most+common+rails+commands+are&type=), I saw that the second result was a [USAGE](https://github.com/rails/rails/blob/ae3e241b573b450fd9ce694a458ad942a8bd6b03/railties/lib/rails/commands/help/USAGE) file in [Railties](https://github.com/rails/rails/tree/master/railties) and it was exactly what I was looking for. Now I needed to understand how this `USAGE` file gets invoked.

I immediately added `spec.add_development_dependency 'railties', '~> 5'` to my gem and opened up directory containing the `USAGE` file. In the same directory is [help_command.rb](https://github.com/rails/rails/blob/ae3e241b573b450fd9ce694a458ad942a8bd6b03/railties/lib/rails/commands/help/help_command.rb).

```ruby
module Rails
  module Command
    class HelpCommand < Base # :nodoc:
```

Seeing that `HelpCommand` is a subclass of [Rails::Command::Base](https://github.com/rails/rails/blob/ae3e241b573b450fd9ce694a458ad942a8bd6b03/railties/lib/rails/command/base.rb) I jumped to defintion of `Base` because I'm trying to generate files, not output help information. 

```ruby
require "rails/command/actions"

module Rails
  module Command
    class Base < Thor
```    

Looking at `Rails::Command::Base` one of the first things I noticed that it has [require "rails/command/actions"](https://github.com/rails/rails/blob/ae3e241b573b450fd9ce694a458ad942a8bd6b03/railties/lib/rails/command/base.rb#L9) right above the class definition. I assumed that [actions.rb](https://github.com/rails/rails/blob/ae3e241b573b450fd9ce694a458ad942a8bd6b03/railties/lib/rails/command/actions.rb) likely had more information about the available actions that could be invoked. 
Looking into `Rails::Command::Actions` I was pleasantly surprised to see a method definition for [load_generators](https://github.com/rails/rails/blob/ae3e241b573b450fd9ce694a458ad942a8bd6b03/railties/lib/rails/command/actions.rb#L38-L40) and I knew I was on the right track.

```ruby
def load_generators
  Rails.application.load_generators
end
```

I jumped to the definition of [Rails.application](https://github.com/rails/rails/blob/ae3e241b573b450fd9ce694a458ad942a8bd6b03/railties/lib/rails.rb#L39-L41) but unfortunately that didn't inform me about what `application` was supposed to be. I went back and decided that I needed to figure out where `load_generators` was being defined. RubyMine does a great job (sometimes too good when the method definition name is very generic) of finding all the possible places that a method is defined. If it is only defined in a single location, it will jump to directly to that definition, but if there are multiple, it will give you a list of all the locations. For `load_generators` there were only three definition locations, two happened to be in `Rails::Command::Actions` and the other was in [Rails::Engine](https://github.com/rails/rails/blob/ae3e241b573b450fd9ce694a458ad942a8bd6b03/railties/lib/rails/engine.rb#L465-L470).

```ruby
def load_generators(app = self)
  require "rails/generators"
  run_generators_blocks(app)
  Rails::Generators.configure!(app.config.generators)
  self
end
```

Now I knew that the `Rails.application` needed to be my own `Rails::Engine`. I hadn't even written an `Engine` before, but thankfully the Rails team has done a great job adding documentation about writing your own inside of the file! As I started looking through the documentation I came across the portion about [Generators](https://github.com/rails/rails/blob/ae3e241b573b450fd9ce694a458ad942a8bd6b03/railties/lib/rails/engine.rb#L52-L62)

```ruby
# == Generators
#
# You can set up generators for engines with <tt>config.generators</tt> method:
#
#   class MyEngine < Rails::Engine
#     config.generators do |g|
#       g.orm             :active_record
#       g.template_engine :erb
#       g.test_framework  :test_unit
#     end
#   end
```

This looked exactly what I needed so quickly created my own and attempted to generate a migration.
```ruby
module GemWithDatabase
  class Engine < Rails::Engine
    config.generators do |g|
      g.orm :active_record
    end
  end
end
```

```bash
$ exe/gem_rails g migration create_user name:string age:integer
      invoke  active_record
      create    db/migrate/20180226042736_create_user.rb
```

Success, I was able to use `rails g` and generate my migration! The only caveat was that I had to name the file `gem_rails` because once I installed the gem into an actual `Rails` application, things started to not play nicely together.

```ruby
class CreateUser < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :name
      t.integer :age
    end
  end
end
```

My main takeaways from this experience were the importance of writing code in a manner that allows another user to come into the code understand the possibilities.  In my opinion, someone should either understand exactly what the code is supposed to do, say a succinct method for example, or they should be able to follow the code to different methods or classes through well-defined and named APIs. Oh, and don't forget about update to date comments and documentation in the code too! While it was easy to write those sentences, writing code that follows those principles isn't always so easy. The Rails team (and I mean all contributors!) should be applauded for making life so easy for the rest of us.
