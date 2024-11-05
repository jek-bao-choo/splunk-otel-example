# frozen_string_literal: true

class DatabaseTestController < ApplicationController
  include DatabaseSyncable
  def write
    ActiveRecord::Base.connected_to(role: :writing) do
      db_info = ActiveRecord::Base.connection_db_config.configuration_hash
      post = Post.create!(
        title: "Test Post #{Time.current}",
        content: "Written to #{db_info[:database]}"
      )

      # Trigger sync after write (Note: In production, you wouldn't do this)
      Rails.application.load_tasks
      Rake::Task['db:sync_replica'].invoke
      Rake::Task['db:sync_replica'].reenable  # Allow task to be run again

      render json: {
        message: 'Write test',
        database: db_info,
        post: post.attributes
      }
    end
  end

  def read
    ActiveRecord::Base.connected_to(role: :reading) do
      db_info = ActiveRecord::Base.connection_db_config.configuration_hash
      posts = Post.all

      render json: {
        message: 'Read test',
        database: db_info,
        post_count: posts.count,
        posts: posts.map(&:attributes)
      }
    end
  end

  # Add a sync endpoint for testing
  def sync
    Rails.application.load_tasks
    Rake::Task['db:sync_replica'].invoke
    Rake::Task['db:sync_replica'].reenable

    render json: { message: 'Sync completed' }
  end
end
