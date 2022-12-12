$(document).ready(function() {
    getAccessToken();
});

function getAccessToken() {
    var projectID = "project1.myapp.in"
    var scope = "email"
    var redirectURL = window.location.origin + "/profile.html"
    var projectSecret = "4e520bf51eb4a446d05f0a0ed72d63b9da4459d430bcdf2165b79507edcbebcb"
    var search = window.location.search + `&projectID=${projectID}&scope=${scope}&redirectURL=${redirectURL}&projectSecret=${projectSecret}`;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            getUserInfo(jsonData.access_token)
        } else if (this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            $("body").empty();
            $("body").append(`<p>${res.message}</p>`);
        }
    };
    xhttp.open("GET", "http://localhost:3000/api/oauth/token" + search, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function getUserInfo(access_token) {
    var search = `?access_token=${access_token}`;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            setUserInfo(jsonData)
        } else if (this.readyState == 4) {
            var res = JSON.parse(this.responseText);
            $("body").empty();
            $("body").append(`<p>${res.message}</p>`);
        }
    };
    xhttp.open("GET", "http://localhost:3000/api/oauth/userinfo" + search, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
}

function setUserInfo(userInfo) {
    $('#name').val(userInfo.name);
    $('#email').val(userInfo.email);
    $('#id').val(userInfo._id);
}