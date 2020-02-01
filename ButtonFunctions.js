function OpenTab(evt, tabId) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("TabContent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("ActiveTabButton");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className = "TabButton";
    }

    document.getElementById(tabId).style.display = "block";
    evt.currentTarget.className = "ActiveTabButton";
}

function OpenChatTab(chatId) {
    var tabcontent = document.getElementsByClassName("TabContent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    var tablinks = document.getElementsByClassName("ActiveTabButton");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className = "TabButton";
    }

    document.getElementById("chat_" + chatId).style.display = "block";
    document.getElementById("button_" + chatId).className = "ActiveTabButton";
}

function SubmitName() {
    var inputBox = document.getElementById("UsernameInput");
    var value = inputBox.value.trim();
    var regexp = new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]+$");
    if (value.length < 2) {
        alert("Ditt namn måste vara minst två tecken långt");
        return;
    }
    if (value.length > 16) {
        alert("Ditt namn får inte vara mer än 16 tecken långt");
        return;
    }
    if (regexp.test(value)) {
        EnterChat(value);
    }
    else {
        alert("Ditt namn får inte innehålla specialtecken");
        return;
    }
}