namespace :db do
  desc 'Sync primary database to replica'
  task sync_replica: :environment do
    puts "Starting database sync..."

    begin
      # Stop any active connections to replica
      ActiveRecord::Base.connection.close if ActiveRecord::Base.connected?

      # Copy primary to replica
      primary_db = Rails.root.join('db', 'primary_development.sqlite3')
      replica_db = Rails.root.join('db', 'replica_development.sqlite3')

      # Check if primary exists
      unless File.exist?(primary_db)
        puts "Error: Primary database not found!"
        exit 1
      end

      # Perform the copy
      FileUtils.cp(primary_db, replica_db)
      puts "Database sync completed successfully!"

      # Verify the sync
      ActiveRecord::Base.connected_to(role: :reading) do
        puts "Replica database now has #{Post.count} posts"
      end

    rescue StandardError => e
      puts "Error during sync: #{e.message}"
      puts e.backtrace
    end
  end
end
