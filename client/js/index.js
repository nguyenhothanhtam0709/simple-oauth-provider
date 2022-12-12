var projectID = "project1.myapp.in"
var scope = "email"
var redirectURL = window.location.origin + "/profile.html"

function login() {
    window.location.href = `http://localhost:3000/login?projectID=${projectID}&scope=${scope}&redirectURL=${redirectURL}`
}