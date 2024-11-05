namespace :db do
  desc "Setup replica database and sync with primary"
  task setup_replica: :environment do
    # Copy primary database to replica
    FileUtils.cp(
      Rails.root.join("db", "primary_development.sqlite3"),
      Rails.root.join("db", "replica_development.sqlite3")
    )
    puts "Replica database created and synced with primary"
  end
end
