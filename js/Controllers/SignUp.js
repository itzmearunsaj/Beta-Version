$(document).ready(function () {
    Parse.$ = jQuery;

    $("#btnSubmit").click(function () {
        if (validateForm()) {

            var apUsers = Parse.Object.extend("ApplicationUsers");
            var apUsersQuery = new Parse.Query(apUsers);
            apUsersQuery.equalTo("Email", $('#email').val());
            apUsersQuery.find({
                success: function (results) {
                    if (results !== null && results.length > 0) {
                        var user = new Parse.User();
                        user.set("username", $("#email").val());
                        user.set("firstName", $("#firstName").val());
                        user.set("lastName", $("#lastName").val());
                        user.set("password", $("#password").val());
                        user.signUp(null, {
                            success: function (user) {
                                if (results[0].attributes["Type"] === "T") {
                                    location.href = "/TeachersHome.html";
                                } else if (results[0].attributes["Type"] === "A") {
                                    location.href = "/AddUsers.html";
                                }
                                else {
                                    location.href = "MyClasses.html";
                                }

                                // Hooray! Let them use the app now.
                            },
                            error: function (user, error) {
                                switch (error.code) {
                                    case 202:
                                        toastr.error(error.message);
                                        break;
                                    default:
                                        toastr.error("Error: " + error.code + " " + error.message);
                                        break;
                                }
                            }
                        });
                    } else {
                        toastr.error("Invalid user id..!");
                    }
                }
            });
        }
    });

    function validateForm() {
        if ($("firstName").val() === "" || $("lastName").val() === "" || $("email").val() === "" || $("password").val() === "" || $("confirmPassword").val() === "") {
            toastr.error("Missing mandatory fields..!");
            return false;
        }

        if ($("confirmPassword").val() !== $("password").val()) {
            toastr.error("Passwords not matching..!");
            return false;
        }

        return true;
    }
});