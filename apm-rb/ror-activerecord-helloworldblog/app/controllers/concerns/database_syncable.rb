# frozen_string_literal: true

module DatabaseSyncable
  extend ActiveSupport::Concern

  private

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
