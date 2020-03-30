function setVal(storageKey, isIncognito) {
    chrome.tabs.getSelected(null, function (tab) {
        var tablink = getBaseUrl(tab.url);
        chrome.storage.local.get(storageKey, (res) => {
            var arr = res[storageKey];
            if (!Array.isArray(arr) || arr.length == 0) {
                arr = [];
            }

            arr = [...arr, tablink];
            var obj = {};
            obj[storageKey] = arr;
            chrome.storage.local.set(obj, function () {
                console.log(tablink + ' is added to the ' + storageKey);
                if (isIncognito)
                    openInIncognito();

                //check if the data is added
                chrome.storage.local.get(storageKey, (res)=>{
                    console.log(res);
                })
            });
        });
    });
}

function getVal(storageKey) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(storageKey, (res) => {
            res = res[storageKey];
            resolve(res);
        });
    });
}

function openInIncognito() {
    chrome.tabs.getSelected(null, function (tab) {
        var tablink = tab.url;

        chrome.tabs.query({
                'active': true,
                'windowId': chrome.windows.WINDOW_ID_CURRENT
            },
            function (tabs) {
                //closing 
                chrome.tabs.remove(tabs[0].id);
            }
        );

        chrome.history.deleteUrl({
            url: tablink
        });

        chrome.windows.create({
            url: tablink,
            incognito: true
        });
    })
}

function getBaseUrl(url) {
    var pathArray = url.split('/');
    var host = pathArray[2];
    return host;
}