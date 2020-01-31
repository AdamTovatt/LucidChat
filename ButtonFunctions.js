function OpenTab(evt, cityName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("TabContent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("TabButton");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
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