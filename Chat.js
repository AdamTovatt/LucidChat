var screen_CreateUser = null;
var screen_Chat = null;

var api = null;
var userId = null;

var chats = [];

window.onload = async function () {
    screen_CreateUser = document.getElementById("Screen_CreateUser");
    screen_Chat = document.getElementById("Screen_Chat");

    screen_CreateUser.style.display = "block";

    api = new Api();
    await api.CleanDatabase();

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

    userId = response["id"];

    var users = JSON.parse(await api.GetUsers());

    if (users["success"]) {

        var userList = document.getElementById("UserList");
        userList.innerHTML = "";
        var table = document.createElement("table");
        table.className = "UserList";

        for (var i = 0; i < users.message.length; i++) {
            var tr = table.insertRow(-1);
            var name = users.message[i]["username"];
            var id = users.message[i]["id"];
            if (id != userId)
                tr.insertCell(-1).innerHTML = '<button class="Button" onclick="OpenNewChat(\'' + name + '\', \'' + id + '\')">' + name + '</button>';
        }

        userList.appendChild(table);

        screen_CreateUser.style.display = "none";
        screen_Chat.style.display = "block";

        document.getElementById("UserListButton").click();
    }
    else {
        alert("Okänt fel när användare skulle hämtas");
    }
}

async function OpenNewChat(betaName, betaId) {
    var existingChat = null;
    for (var i = 0; i < chats.length; i++) {
        if (chats[i]["betaId"] == betaId)
            existingChat = chats[i];
    }
    if (existingChat == null) {
        var createChatResponse = JSON.parse(await api.CreateChat(userId, betaId));
        if (!createChatResponse["success"]) {
            alert("Okänt fel när chatt skulle skapas");
            return;
        }
        existingChat = { id: createChatResponse["id"], betaId, betaName };

        chats.push(existingChat);

        var button = document.createElement("button");
        button.className = "TabButton";
        button.onclick = function () { OpenTab(event, "chatt_" + existingChat.id) };
        button.innerHTML = betaName;

        document.getElementById("TabButtons").appendChild(button);

        var div = document.createElement("div");
        div.className = "TabContent";
        div.innerHTML = "En chatt med " + betaName;
        div.id = "chatt_" + existingChat.id;

        screen_Chat.appendChild(div);
    }
    else {
        setTimeout(function () { document.getElementById("chatt_" + existingChat.id).click(); }, 1000);
    }
}