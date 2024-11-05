Assuming the basics of ROR is setup. If not refer to the basic hello world example in apm-rb folder.

Step 1: Create a new Rails application

```
rails new ror-activerecord-helloworldblog
cd ror-activerecord-helloworldblog
```

Step 2: Generate a basic Post model:
```
rails generate model Post title:string content:text
rails db:migrate
```

Step 3: Generate the controller:
```
rails generate controller Posts index new create
```

Update the relevant files with these codes.

```ruby

# app/models/post.rb
class Post < ApplicationRecord
  validates :title, presence: true
  validates :content, presence: true
end

# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  def index
    @posts = Post.all
  end

  def new
    @post = Post.new
  end

  def create
    @post = Post.new(post_params)
    if @post.save
      redirect_to posts_path, notice: 'Post created!'
    else
      render :new
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :content)
  end
end

# config/routes.rb
Rails.application.routes.draw do
  root 'posts#index'
  resources :posts, only: [:index, :new, :create]
end

# app/views/posts/index.html.erb
<h1>Blog Posts</h1>

<%= link_to 'Write New Post', new_post_path %>

<% @posts.each do |post| %>
  <div>
    <h2><%= post.title %></h2>
    <p><%= post.content %></p>
  </div>
<% end %>

# app/views/posts/new.html.erb
<h1>Write New Post</h1>

<%= form_with(model: @post, local: true) do |form| %>
  <div>
    <%= form.label :title %>
    <%= form.text_field :title %>
  </div>

  <div>
    <%= form.label :content %>
    <%= form.text_area :content %>
  </div>

  <%= form.submit 'Create Post' %>
<% end %>

<%= link_to 'Back to Posts', posts_path %>

```

Step 4: Start the server:
```
rails server
```

- Visit http://localhost:3000
- Click "Write New Post" to create a post
- View all posts on the homepage

Step 5: experiment with ActiveRecord in the console
```ruby
rails console

# Create a post
Post.create(title: "HelloJek", content: "World!")

# Find all posts
Post.all

# Find specific post
Post.find_by(title: "HelloJek")
```

