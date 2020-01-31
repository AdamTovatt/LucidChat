﻿var screen_CreateUser = null;
var screen_Chat = null;

var api = null;
var userId = null;

window.onload = function () {
    screen_CreateUser = document.getElementById("Screen_CreateUser");
    screen_Chat = document.getElementById("Screen_Chat");

    screen_CreateUser.style.display = "block";

    api = new Api();

    console.log("test");
}

async function EnterChat(username) {
    var response = { success: true, id: 19, message: "ok" };
    //var response = JSON.parse(await api.CreateUser(username));
    if (!response["success"]) {
        if (response.message["code"] == 23505) {
            alert("Det namnet är upptaget just nu");
            return;
        }
        else {
            alert("Okänt fel, försök igen");
            return;
        }
    }

    screen_CreateUser.style.display = "none";
    screen_Chat.style.display = "block";
    userId = response["id"];
}