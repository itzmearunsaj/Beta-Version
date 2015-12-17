$(function () {

    Parse.$ = jQuery;

    // Initialize Parse with your Parse application javascript keys
    Parse.initialize("UIX2yWbJR0BBg4sUvxTkFracFjlaXt4q4Ee18whZ", "odtjY02VHcst6CVS2OPxEGSfwpQPmykHQeBFpACu");
    var currentUser = Parse.User.current();
    if (!currentUser) {
        location.href = "/index.html";
    }

    $("#btnSignOut").click(function () {
        Parse.User.logOut();
        location.href = "/index.html";
    });
});