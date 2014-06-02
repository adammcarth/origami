require "bundler"
Bundler.require(:default)
require "date"

# Configure JTask environment settings
JTask.configure do |config|
  config.file_dir = "storage"
end

class Origami < Sinatra::Base
  # Allow sessions & cookie data to be used
  set :sessions, true
  helpers Sinatra::Cookies

  helpers do
    # Require each file (containing various functions) from the `/helpers` directory.
    Dir["./helpers/*.rb"].each &method(:require)
  end

  #############################################################
  # MAIN APPLICATION LOGIC ####################################
  #############################################################

  # When a user visits the home page
  get "/" do
    authenticate!
    @breadcrumb = "home"
    @lessons = JTask.get("lessons.json")
    @todays_lessons = Array.new
    @lessons.each do |lesson|
      if Time.now.strftime("%d-%m") == Date.parse(lesson.lesson_time).strftime("%d-%m")
        @todays_lessons << lesson
      end
    end
    # render the homepage UI
    erb :index
  end

  post "/api" do
    authenticate!
    first_name = params[:customer_fname]
    last_name = params[:customer_lname]
    email = params[:customer_email]
    phone = params[:customer_phone]
    address = params[:customer_address]
    notes = params[:notes]
    num_lessons = params[:numLessons]
    if params[:order_price] != ""
      order_price = params[:order_price]
    else
      order_price = 0
    end

    num_lessons.to_i.times do |n|
      date = params[:lesson_time]["#{n + 1}"]["date"]
      time = params[:lesson_time]["#{n + 1}"]["time"]
      # Validation
      if date == "" or time == ""
        session[:notification] = ["error", "<b>Submission failed.</b> You need to fill out the lesson date/time fields next time!"]
        redirect "/"
      end
      timestamp = Chronic.parse("#{date} at #{time}")

      JTask.save("lessons.json", {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        address: address,
        notes: notes,
        lesson_time: timestamp
      })
    end

    session[:notification] = ["success", "<b>All done.</b> #{first_name}'s lessons have been saved to the system."]
    redirect "/invoice?num_lessons=#{num_lessons}&order=#{order_price}"
  end

  get "/invoice" do
    authenticate!
    @order_price = params[:order].to_i
    @num_lessons = params[:num_lessons].to_i
    @subtotal = calculate_lesson_price(@num_lessons, @order_price)
    @gst = gst(@subtotal)
    erb :invoice
  end

  get "/lessons" do
    authenticate!
    @all_lessons = JTask.get("lessons.json")
    @lessons = Array.new
    @all_lessons.each do |lesson|
      # Only show lessons that are in the future
      if DateTime.parse(lesson.lesson_time).strftime("%e-%b-%G") > Time.now.strftime("%e-%b-%G") or DateTime.parse(lesson.lesson_time).strftime("%e-%b-%G") == Time.now.strftime("%e-%b-%G")
        @lessons << lesson
      end
    end
    erb :lessons
  end

  get "/delete_lesson/:id" do
    authenticate!
    @name = JTask.get("lessons.json", params[:id].to_i).first_name
    JTask.destroy("lessons.json", params[:id].to_i)
    session[:notification] = ["warning", "#{@name}'s lesson has been successfully removed from the system."]
    redirect "/lessons"
  end

  get "/settings" do
    authenticate!
    @breadcrumb = "settings"
    @user = JTask.get("users.json", current_user)
    @lesson_price = JTask.get("prices.json", 1).lesson_price
    erb :settings
  end

  post "/settings" do
    authenticate!
    # UPDATE THE USER ACCOUNT
      # Update the user with the username specified
      JTask.update("users.json", current_user, username: params[:username])
      # If the new passwords don't match, display an error message.
      if params[:new_password] != params[:confirm_password]
        session[:notification] = ["error", "<b>Error:</b> Your system preferences couldn't be updated because your new passwords don't match."]
        redirect "/settings"
      end
      # We don't want to update a password if the field has been
      # left intentionally blank.
      unless params[:new_password] == ""
        salt = BCrypt::Engine.generate_salt
        hashed_password = BCrypt::Engine.hash_secret(params[:new_password], salt)
        JTask.update("users.json", session[:user], {password: hashed_password, salt: salt})
      end
    # UPDATE THE LESSON PRICE
      JTask.update("prices.json", 1, lesson_price: params[:lesson_price].to_i)
    session[:notification] = ["success", "<b>Nice.</b> Your system preferences have been successfully updated."]
    redirect "/settings"
  end

  # Only show the "settings message" once
  get "/msgRecieved" do
    session[:msgRecieved] = true
    "All done."
  end


  #############################################################
  # USER ACCOUNTS ROUTES ######################################
  #############################################################
  get "/login" do
    @breadcrumb = "login"
    # redirect the user if they are already signed in
    if current_user
      session[:notification] = ["warning", "You're already signed in!"]
      redirect "/"
    end
    # otherwise render the login UI
    @no_content_bg = true
    erb :login
  end

  post "/new_session" do
    @user = JTask.get("users.json", 1)
    # if the username and password match the one in storage
    if @user.username == params[:username] && @user.password == BCrypt::Engine.hash_secret(params[:password], @user.salt)
      session[:user] = @user.id
      redirect "/"
    else
      session[:notification] = ["error", "<b>Oops.</b> The login information you used appears to be invalid."]
      redirect "/login"
    end
  end

  get "/logout" do
    session[:user] = nil
    cookies[:autologin] = nil
    session[:notification] = ["success", "<b>All clear.</b> You have been signed out successfully."]
    redirect "/login"
  end
end