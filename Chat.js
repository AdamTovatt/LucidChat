var screen_CreateUser = null;
var screen_Chat = null;

var chatInputArea = null;
var chatInputBox = null;

var api = null;
var userId = null;

var currentChat = null;

var chats = [];
var knownAuthors = [];

window.onload = async function () {
    screen_CreateUser = document.getElementById("Screen_CreateUser");
    screen_Chat = document.getElementById("Screen_Chat");
    this.chatInputArea = this.document.getElementById("ChatInputArea");
    this.chatInputBox = this.document.getElementById("ChatTextInput");

    screen_CreateUser.style.display = "block";

    api = new Api();
    await api.CleanDatabase();
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

        GetUserChats();
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

        AddChatButton(existingChat);
    }

    setTimeout(function () { OpenChatTab(existingChat.id); }, 100);
}

function AddChatButton(chat) {
    var button = document.createElement("button");
    button.className = "TabButton";
    var id = chat.id;
    button.onclick = function () { OpenChatTab(id) };
    button.innerHTML = chat.betaName;
    button.id = "button_" + chat.id;

    document.getElementById("TabButtons").appendChild(button);

    var div = document.createElement("div");
    div.className = "TabContent";
    //div.innerHTML = "En chatt med " + chat.betaName;
    div.id = "chat_" + chat.id;

    var chatTable = document.createElement("table");
    chatTable.id = "chatTable_" + chat.id;
    chatTable.className = "ChatTable";
    div.appendChild(chatTable);

    screen_Chat.appendChild(div);

    var chat = GetChatById(chat.id);
    if (chat)
        chat.added = true;
}

function GetChatById(id) {
    for (var i = 0; i < chats.length; i++) {
        if (chats[i].id == id)
            return chats[i];
    }
    return null;
}

async function GetUserChats() {
    var response = JSON.parse(await api.GetUserChats(userId));
    if (response["success"]) {
        for (var i = 0; i < response["message"].length; i++) {
            var chat = response["message"][i];
            var existingChat = GetChatById(chat["id"]);
            if (existingChat && existingChat.added)
                continue;
            var otherId = chat["alphaid"] == userId ? chat["betaid"] : chat["alphaid"];
            var otherName = await GetAuthorName(otherId);
            otherName = await GetAuthorName(otherId);
            var newChat = { id: chat["id"], betaId: otherId, betaName: otherName };
            chats.push(newChat);
            AddChatButton(newChat);
        };
    }
}

async function LoadCurrentChat() {
    var chatResponse = JSON.parse(await api.GetChat(currentChat));

    console.log(currentChat);
    var chatObject = GetChatById(currentChat); //hämtar den sparade chatten från minnet
    if (!chatObject.lastMessageId) //förbered id för sista medelandet som har ritats ut
        chatObject.lastMessageId = 0;
    if (!chatObject.lastLength)
        chatObject.lastLength = 0; //förbered längd som det var sist vi kollade

    if (chatResponse["success"]) {
        var currentChatTable = document.getElementById("chatTable_" + currentChat);

        if (chatResponse["message"]["messages"].length > 0 && chatResponse["message"]["messages"].length > chatObject.lastLength) {
            var betaName = null;
            for (var i = 0; i < chatResponse["message"]["messages"].length; i++) { //för att hitta namnet på andra personen
                if (chatResponse["message"]["messages"][i]["authorid"] != userId) {
                    betaName = await GetAuthorName(chatResponse["message"]["messages"][i]["authorid"]);
                    break;
                }
            }

            for (var i = 0; i < chatResponse["message"]["messages"].length; i++) {
                var message = chatResponse["message"]["messages"][i];
                if (message.id > chatObject.lastMessageId) {
                    var ownMessage = message["authorid"] == userId;
                    var messageAuthor = ownMessage ? "Du" : betaName; //"Du" används här så att det alltid står det på ens egna medelanden
                    var messageText = message["textcontent"];
                    var messageTime = message["senttime"];

                    console.log(messageAuthor + " (" + messageTime + "): " + messageText);

                    var bubble = document.createElement("div");
                    bubble.className = ownMessage ? "OwnMessage" : "OtherMessage";
                    bubble.innerHTML = messageText;

                    var row = currentChatTable.insertRow(-1);
                    row.insertCell(-1).appendChild(bubble);

                    //currentChatTable.appendChild(bubble);
                }
                else {
                    console.log("har redan detta medelande");
                }
            }

            chatObject.lastLength = chatResponse["message"]["messages"].length; //uppdaterar den senaste längden
        }
    }
}

async function GetAuthorName(id) {
    for (var i = 0; i < knownAuthors.length; i++) {
        if (knownAuthors[i].id == id) {
            return knownAuthors[i].name;
        }
    }
    var response = JSON.parse(await api.GetUserInfo(id));
    if (response["success"]) {
        knownAuthors.push({ name: response["message"]["username"], id: id });
    }
}