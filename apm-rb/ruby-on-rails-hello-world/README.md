# Hello World with Ruby on Rails

Install Ruby using rbenv:

```bash
brew install rbenv
rbenv init
rbenv install 3.2.2
rbenv global 3.2.2
```

First, make sure you've properly initialized rbenv. Add these lines to your ~/.zshrc or ~/.bash_profile file (depending on which shell you're using):

```
eval "$(rbenv init -)"
export PATH="$PATH:$HOME/.rbenv/shims"
```

Then, reload your shell configuration:

```
source ~/.zshrc
```

Verify that you're using the rbenv-managed Ruby:

```
which ruby
```

Install Rails:

```
gem install rails
```

Create a new Rails application:

```
rails new movie_streamer
cd movie_streamer
```

Generate a controller for our hello world page:
```
rails generate controller Home index
```

Set the root route in config/routes.rb:
```
Rails.application.routes.draw do
  root 'home#index'
end
```

Edit app/views/home/index.html.erb:

```html
<h1>Hello, World Jek!</h1>
```

Start the Rails server:
```bash
rails server
```

# Add OpenTelemetry SDK
Open your project's Gemfile in a text editor. You can do this with any text editor you prefer, or use a command like:
```
code Gemfile
```

Add the following lines to your Gemfile:
```ruby
gem 'opentelemetry-sdk'
gem 'opentelemetry-exporter-otlp'
gem 'opentelemetry-instrumentation-all'
```

Run bundle install
```
bundle install
```

Create an initializer config/initializers/opentelemetry.rb:
```ruby
require 'opentelemetry/sdk'
require 'opentelemetry/exporter/otlp'
require 'opentelemetry/instrumentation/all'

OpenTelemetry::SDK.configure do |c|
  c.service_name = 'movie_streamer'
  c.use_all() # This enables automatic instrumentation
end
```

Stop and start the Rails server:

```bash
rails server
```
