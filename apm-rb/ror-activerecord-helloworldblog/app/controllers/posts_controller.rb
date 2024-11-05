class PostsController < ApplicationController
  # Use replica for reading
  def index
    ActiveRecord::Base.connected_to(role: :reading) do
      @posts = Post.all
    end
  end

  # Use replica for showing individual posts
  def show
    ActiveRecord::Base.connected_to(role: :reading) do
      @post = Post.find(params[:id])
    end
  end

  # Use primary for creating new posts
  def create
    ActiveRecord::Base.connected_to(role: :writing) do
      @post = Post.new(post_params)
      if @post.save
        redirect_to posts_path, notice: 'Post created!'
      else
        render :new
      end
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :content)
  end

end
