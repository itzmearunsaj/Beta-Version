﻿$(document).ready(function () {
    Parse.$ = jQuery;

    // Initialize Parse with your Parse application javascript keys
    //Parse.initialize("UIX2yWbJR0BBg4sUvxTkFracFjlaXt4q4Ee18whZ", "odtjY02VHcst6CVS2OPxEGSfwpQPmykHQeBFpACu");

    $("#btnLogin").click(function () {
        var user = new Parse.User();
        var username = $("#userName").val();
        var password = $("#password").val();
        if (username === "" && password === "") {
            toastr.error("Enter UserName/Password..!");
            return;
        } else if (!isValidEmailAddress(username)) {
            toastr.error("Invalid email address..!");
            return;
        }
        Parse.User.logIn(username, password, {
            success: function (user) {
                var apUsers = Parse.Object.extend("ApplicationUsers");
                var apUsersQuery = new Parse.Query(apUsers);
                apUsersQuery.equalTo("Email", username);

                apUsersQuery.find({
                    success: function (results) {
                        if (results.length > 0) {
                            if (results[0].attributes["Type"] === "T") {
                                location.href = "/TeachersHome.html";
                            } else if (results[0].attributes["Type"] === "A") {
                                location.href = "/AddUsers.html";
                            }
                            else {
                                location.href = "StudentHome.html";
                            }
                        }
                    }
                });
            },

            error: function (user, error) {
                //$('#btnLogin').attr('disabled', false);
                toastr.error("Invalid username or password. Please try again.");
            }
        });
    });

    window.fbAsyncInit = function () {
        // init the FB JS SDK
        Parse.FacebookUtils.init({
            appId: '1532730107042645',                        // App ID from the app dashboard
            channelUrl: '//localhost:1256/index.html', // Channel File
            status: false,                                 // Check Facebook Login status
            xfbml: true,                                  // Look for social plugins on the page
            logging: true,
            version: 'v2.0'
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    $("#btnFacebook").click(function () {
        Parse.FacebookUtils.logIn(null, {
            success: function (user) {
                FB.api('/me', { fields: 'email,first_name,last_name' }, function (userInfo) {
                    if (userInfo.email) {
                        var apUsers = Parse.Object.extend("User");
                        var apUsersQuery = new Parse.Query(apUsers);
                        apUsersQuery.equalTo("Email", userInfo.email);
                        apUsersQuery.find({
                            success: function (results) {
                                if (results.length === 0) {
                                    signUpUser(userInfo);
                                }
                            }
                        });
                    }
                });
            },
            error: function (user, error) {
                toastr.error("User cancelled the Facebook login or did not fully authorize.");
            }
        });
    });

    function signUpUser(userInfo) {
        var apUsers = Parse.Object.extend("ApplicationUsers");
        var apUsersQuery = new Parse.Query(apUsers);
        apUsersQuery.equalTo("Email", userInfo.email);
        apUsersQuery.find({
            success: function (results) {
                if (results.length > 0) {
                    var user = new Parse.User();
                    user.set("username", userInfo.email);
                    user.set("firstName", userInfo.first_name);
                    user.set("lastName", userInfo.last_name);
                    user.set("password", userInfo.id);
                    user.signUp(null, {
                        success: function (user) {
                            if (results[0].attributes["Type"] === "T") {
                                location.href = "/TeachersHome.html";
                            } else if (results[0].attributes["Type"] === "A") {
                                location.href = "/AddUsers.html";
                            }
                            else {
                                location.href = "StudentHome.html";
                            }
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