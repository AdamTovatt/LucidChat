class Api {
    constructor() {
        this.basePath = "https://virtual-greeting.herokuapp.com/";
    }

    async GetResponse(method, url, data = null) {
        var requestUrl = this.basePath + url;
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, requestUrl);
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            if (data != null) {
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.send(JSON.stringify(data));
            }
            else {
                xhr.send();
            }
        });
    }

    async Init() {
        var path = "greeting/init";
        return await this.GetResponse("POST", path);
    }

    async GetGreetingData(id, hash) {
        var path = "greeting/view/?id=" + id + "&hash=" + hash;
        return await this.GetResponse("GET", path);
    }

    async UpdateGreetingData(id, hash, data) {
        var path = "greeting/update/?id=" + id + "&hash=" + hash;
        if (data.texts)
            for (var i = 0; i < data.texts.length; i++) {
                data.texts[i].text = data.texts[i].text.replace("<div>", "").replace("</div>", "");
            }
        return await this.GetResponse("POST", path, { greetingdata: data });
    }
}