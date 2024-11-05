class PostsController < ApplicationController
  # Use replica for reading
  def index
    Rails.logger.info "Attempting to read from replica database"
    ActiveRecord::Base.connected_to(role: :reading) do
      Rails.logger.info "Connected to: #{ActiveRecord::Base.connection_db_config.configuration_hash}"
      @posts = Post.all
      Rails.logger.info "Found #{@posts.count} posts"
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
    Rails.logger.info "Attempting to write to primary database"
    ActiveRecord::Base.connected_to(role: :writing) do
      Rails.logger.info "Connected to: #{ActiveRecord::Base.connection_db_config.configuration_hash}"
      @post = Post.new(post_params)

      if @post.save
        Rails.logger.info "Successfully saved post to primary database"
        redirect_to posts_path, notice: 'Post created!'
      else
        Rails.logger.error "Failed to save post: #{@post.errors.full_messages}"
        render :new
      end
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :content)
  end

end
