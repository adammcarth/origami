# Shows messages to the user that are set in between requests,
# eg - when a user signs in to the system a success message must be
# displayed on the next page. These are set using sessions so that
# it is not displayed again on the next request.
def display_flash_notifications
  html = nil

  if session[:notification] and session[:notification].is_a?(Array)
    type = session[:notification][0]
    text = session[:notification][1]
    html = "<div class=\"alert alert-#{type}\">#{text}<div class=\"close\"></div></div>"
  end

  # Clear the session so as to not display the message again.
  session[:notification] = nil

  return html
end