// Keep a watchful eye on the size of the content area
var lastHeight = $(".content").outerHeight();

// Adjust content settings as appropriate
function adjust_content() {
  // Adjust the `margin-top` on the content area if the size changes
  var topMargin = ($(window).height() - $(".wrapper").outerHeight()) / 2.2;
  var tooFar = ($(window).height() - 200 - $(".wrapper").outerHeight());
  if (tooFar < 0) {
    topMargin = 100;
    $(".wrapper").css("margin-bottom", topMargin);
  }
  $(".wrapper").css("margin-top", topMargin);

  // If the current content size doesn't equal the last height measured (ie - it has changed)
  if ($(".content").outerHeight() != lastHeight) {
    lastHeight = $(".content").outerHeight();
    // Continue to update the `.stack` class if the content size changes
    set_stack_height();
  }

  setTimeout(adjust_content, 0);
}

// Set the height of the border container (`.stack`) equal to the content area
function set_stack_height() {
  $(".stack").css("height", $(".content").outerHeight() - 2);
}

// Shorthand javascript function to show error/success messages to the user
function notify(type, text, location) {
  if (!location) {
    location = ".content"
  }

  $(location).prepend('<div class="alert alert-' + type + '" style="display:none;">' + text + '<div class="close"></div></div>');
  $(".alert").delay(200).slideDown(300);
}

// ---------------------------------------------------------------------------------------------------- //
// .................................................................................................... //
// ---------------------------------------------------------------------------------------------------- //
// .................................................................................................... //
// ---------------------------------------------------------------------------------------------------- //

$(window).load(function() {
  adjust_content();
  set_stack_height();
  $(".alert").hide();
});

$(document).ready(function() {
  // Tooltips
  $(".tooltip, .tooltip-bottom").tipsy({gravity: "n", opacity: 1, html: true, offset: 4});
  $(".tooltip-top").tipsy({gravity: "s", opacity: 1, html: true, offset: 4});
  $(".tooltip-left").tipsy({gravity: "e", opacity: 1, html: true, offset: 6});
  $(".tooltip-right").tipsy({gravity: "w", opacity: 1, html: true, offset: 6});

  $(".form-tooltip, .form-tooltip-bottom").tipsy({trigger: "focus", gravity: "n", opacity: 1, html: true, offset: 4});
  $(".form-tooltip-top").tipsy({trigger: "focus", gravity: "s", opacity: 1, html: true, offset: 4});
  $(".form-tooltip-left").tipsy({trigger: "focus", gravity: "e", opacity: 1, html: true, offset: 6});
  $(".form-tooltip-right").tipsy({trigger: "focus", gravity: "w", opacity: 1, html: true, offset: 6});

  // Click x icon to close alerts
  $(document).on("click", ".close", function() {
    $(this).closest(".alert").slideUp(200, function() {
      $(this).remove();
    });
  });

  // Show the alerts already present on the page (currently hidden)
  $(".alert").delay(200).slideDown(300);

  // Update Settings Validations
  $("#update_settings").submit(function() {
    if ($("#new_password").val().length < 6 && $("#new_password").val().length > 0) {
      var change = confirm("Your new password is very weak, are you sure you want to continue?");
      if (change === false) {
        event.preventDefault();
      }
    }
  });
});