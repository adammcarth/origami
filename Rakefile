# Adds the initial user account to the system...
# run using `rake user:initialize` in your terminal or cmd console (after cd'ing to this project)
namespace :user do
  require "jtask"
  require "bcrypt"

  JTask.configure do |config|
    config.file_dir = "storage"
  end

  task :initialize do
    salt = BCrypt::Engine.generate_salt
    password = BCrypt::Engine.hash_secret("123456", salt)
    JTask.save("users.json", {username: "brian", password: password, salt: salt})
  end

  task :reset do
    salt = BCrypt::Engine.generate_salt
    password = BCrypt::Engine.hash_secret("123456", salt)
    JTask.update("users.json", 1, {username: "brian", password: password, salt: salt})
  end
end