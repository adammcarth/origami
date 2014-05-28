# This method checks if a user session exists, and returns the
# id of the signed in user if one exists.
def current_user
  if session[:user] != nil
    # return the user id
    return session[:user]
  else
    return false
  end
end

# This method is used to protect routes (pages) from being
# accessed by users who are not signed in. Public users who access
# a route that is authenticated will be redirect the user to the login page.
def authenticate!
  unless current_user
    redirect "/login"
  end
end