class PostsController < ApplicationController
  # Use replica for reading
  def index
    ActiveRecord::Base.connected_to(role: :reading) do
      @posts = Post.all
    end
  end

  def new
    @post = Post.new
  end

  def create
    ActiveRecord::Base.connected_to(role: :writing) do
      @post = Post.new(post_params)
      if @post.save
        # Sync after successful save
        sync_databases
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

  def sync_databases
    primary_db = Rails.root.join('db', 'primary_development.sqlite3')
    replica_db = Rails.root.join('db', 'replica_development.sqlite3')

    # Close connections before copying
    ActiveRecord::Base.connection_pool.disconnect!

    # Copy primary to replica
    FileUtils.cp(primary_db, replica_db)

    # Reconnect after copying
    ActiveRecord::Base.establish_connection(
      ActiveRecord::Base.configurations.configs_for(env_name: Rails.env, name: 'primary')
    )
  rescue StandardError => e
    Rails.logger.error "Database sync failed: #{e.message}"
  end

end
