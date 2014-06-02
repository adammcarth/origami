// Keep a watchful eye on the size of the content area
var lastHeight = $(".content").outerHeight();

// Adjust content settings as appropriate
function adjust_content() {
  // Adjust the `margin-top` on the content area if the size changes
  var topMargin = ($(window).height() - $(".wrapper").outerHeight()) / 2.2;
  var tooFar = ($(window).height() - 100 - $(".wrapper").outerHeight());
  if (tooFar < 0) {
    topMargin = 50;
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
  $(".alert").delay(400).slideDown(300);
}

// ---------------------------------------------------------------------------------------------------- //
// .................................................................................................... //
// ---------------------------------------------------------------------------------------------------- //
// .................................................................................................... //
// ---------------------------------------------------------------------------------------------------- //

$(window).load(function() {
  adjust_content();
  set_stack_height();
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
  $(".alert").delay(400).slideDown(300);

  // Update Settings Validations
  $("#update_settings").submit(function() {
    if ($("#new_password").val().length < 6 && $("#new_password").val().length > 0) {
      var change = confirm("Your new password is very weak, are you sure you want to continue?");
      if (change === false) {
        event.preventDefault();
      }
    }
  });

  // Only show the settings message once
  $("#msgRecieved").click(function() {
    $.ajax({
      url: "/msgRecieved"
    });
  });

  // Show the lesson calculator
  $("#book_lesson").click(function() {
    $(".calendar").fadeOut(200);
    $(".lesson_calculator").delay(100).slideDown(400);
  });

  // Initialize date-time fields
  $(".date").pickadate({
    min: [(new Date).getFullYear(), (new Date).getMonth(), (new Date).getDay()]
  });
  $(".time").pickatime({
    interval: 60,
    min: [9, 0],
    max: [17, 0]
  });

  // Add name
  $("#customer_fname").blur(function() {
    if (!$(this).val()) {
      $("#addName").text("How many lessons would they like to book?");
    } else {
      first_name = $(this).val();
      $("#addName").text("How many lessons would " + first_name + " like to book?");
    }
  });

  // Some sort of validation
  function activateSubmit() {
    $(".datetime:visible").each(function() {
      if ($(this).val() != "") {
        $("button.send_to_api").removeClass("disabled");
      } else {
        $("button.send_to_api").addClass("disabled");
      }
    });

    setTimeout(activateSubmit, 0);
  }

  activateSubmit();

  // Here we go...
  $("#numLessons").change(function() {
    if ($(this).val === "0") {
      $("#step-3").hide();
    } else {
      $("#addName").remove();
      $("#step-3").show();
      $(".timeslot").hide();
      $(".datetime").attr("name", "");
      for(var i = 0; i < parseInt($("#numLessons").val()) + 1; i++) {
        $("#date-" + i).attr("name", "[lesson_time][" + i + "]date");
        $("#time-" + i).attr("name", "[lesson_time][" + i + "]time");
        $("." + i.toString()).show();
      }
    }
  });

  // Print invoice
  $("#print").click(function() {
    $(".invoice").printArea({mode: "iframe"});
  });
});