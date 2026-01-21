document.addEventListener("DOMContentLoaded", function() {
    var emailLink = document.getElementById("email-link");
    var user = "dalew75";
    var domain = "gmail.com";
    emailLink.href = "mailto:" + user + "@" + domain;
    emailLink.textContent = user + "@" + domain;
});
