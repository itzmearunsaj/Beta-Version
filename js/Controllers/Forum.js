$(document).ready(function () {
    Parse.$ = jQuery;

    var allQuery = new Parse.Query("GroupComments");
    allQuery.equalTo("UserID", "Arun@gmail.com"); 
    allQuery.equalTo("ClassID", "zsO3WjmhyI");
    allQuery.find({
        success: function (c) {
            debugger;
            $.each(c, function () {
                var element = "<li class='clearfix'> <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg' alt='avatar' /> <div class='about'> <div class='name'>" + this.attributes.UserID + "</div> <div class='status'> <i class='fa fa-circle online'></i> online </div> </div> </li>";
                //var element = "<div class='message' style='margin-top: 30px;'> <div class='author'> <p>" + this.attributes.UserID + "  </p> </div> <div class='time'> <p>" + this.createdAt.toLocaleDateString() + "<br />" + this.createdAt.toLocaleTimeString() + "</p> </div> <div class='text' style='word-wrap: break-word;'> <p>" + this.attributes.Comment + "</p> </div> <div class='line'> </div> </div>";
                $("#chatList").append(element);
            });
            var objDiv = document.getElementById("commentsContainer");
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    });
});