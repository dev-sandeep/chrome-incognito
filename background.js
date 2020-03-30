chrome.runtime.onInstalled.addListener(function () {
  /**
   * creating the menu
   */
  chrome.contextMenus.create({
    id: "open-incognito",
    title: "Open in incognito",
    contexts: ["all"],
  });

  chrome.contextMenus.create({
    id: "add-incognito",
    title: "Add to incognito list",
    contexts: ["all"],
  });

  chrome.contextMenus.create({
    id: "reset-incognito-list",
    title: "Reset incognito list",
    contexts: ["all"],
  });

  chrome.contextMenus.create({
    id: "skip-history",
    title: "Skip this website from chrome-history",
    contexts: ["all"],
  });

  chrome.contextMenus.create({
    id: "reset-skip-list",
    title: "Reset skip history list",
    contexts: ["all"],
  });
 
  

  /**
   * not working!
   */
  function decideSkipHistoryMenu() {
    //check if the website is present in the list of skip history
    chrome.storage.local.get('skip-history-list', (res) => {
      chrome.tabs.getSelected(null, function (tab) {
        res = res['skip-history-list'];
        var isExists = false;
        for (var i in res) {
          if (res[i] == getBaseUrl(tab.url)) {
            isExists = true;
            chrome.contextMenus.create({
              id: "skip-history1",
              title: "Skip this website from chrom-history",
              contexts: ["all"],
            });
          }
        }

        if (!isExists) {
          chrome.contextMenus.create({
            id: "skip-history2",
            title: "Let this website log back in chrom-history",
            contexts: ["all"],
          });
        }
      });
    });
  }

  function openInIncognito() {
    //getting the present url
    chrome.tabs.getSelected(null, function (tab) {
      var tablink = tab.url;

      chrome.tabs.query({ 'active': true, 'windowId': chrome.windows.WINDOW_ID_CURRENT },
        function (tabs) {
          //closing the tab
          chrome.tabs.remove(tabs[0].id);
        }
      );

      chrome.history.deleteUrl({ url: tablink });

      chrome.windows.create({
        url: tablink,
        incognito: true
      });
    })
  }

  //You also have the ability to restrict chrome from logging a website in history
  //

  //event listner for onclick of context menus
  chrome.contextMenus.onClicked.addListener(function (info, tab) {
    try {
      if (info.menuItemId == "open-incognito") {
        openInIncognito();
      }

      /**
       * respoinsible for adding the website in the incognito list
       */
      else if (info.menuItemId == "add-incognito") {
        //@todo
        chrome.tabs.getSelected(null, function (tab) {
          var tablink = getBaseUrl(tab.url);
          chrome.storage.local.get('incognito-list', (res) => {
            var arr = res['incognito-list'];
            if (!Array.isArray(arr) || arr.length == 0) {
              arr = [];
            }

            arr = [...arr, tablink];
            chrome.storage.local.set({ 'incognito-list': arr }, function () {
              console.log(tablink + ' is added to the incognito list');
              openInIncognito();
            });
          });
        });
      }
      else if (info.menuItemId == "skip-history") {
        try {
          //getting the present url
          chrome.tabs.getSelected(null, function (tab) {
            var tablink = getBaseUrl(tab.url);

            chrome.storage.local.get('skip-history-list', (res) => {
              var arr = res['skip-history-list'];
              if (!Array.isArray(arr) || arr.length == 0) {
                arr = [];
              }

              arr = [...arr, tablink];
              chrome.storage.local.set({ 'skip-history-list': arr }, function () {
                console.log(tablink + ' is added to the list');
              });

            });

          })
        } catch (e) {
          console.error(e);
        }
      }
      else if(info.menuItemId == "pause-all"){
        chrome.storage.local.set({ 'pause-all': true }, function () {
          console.log(tablink + ' is added to the list');
        });
      }

    } catch (e) {
      console.warn(e);
    }
  });

  function getBaseUrl(url) {
    var pathArray = url.split('/');
    var host = pathArray[2];
    return host;
  }

  chrome.tabs.onUpdated.addListener(() => {
    //not working
    // decideSkipHistoryMenu();
    //getting the present url
    try {
      chrome.tabs.getSelected(null, function (tab) {

        chrome.storage.local.get('skip-history-list', (res) => {
          res = res['skip-history-list'];
          for (var i in res) {
            if (res[i] == getBaseUrl(tab.url)) {
              chrome.history.deleteUrl({ url: tab.url });
              console.log("clearing " + tab.url);
            }
          }
        })

        chrome.storage.local.get('incognito-list', (res) => {
          res = res['incognito-list'];
          for (var i in res) {
            if (res[i] == getBaseUrl(tab.url)) {
              openInIncognito();
            }
          }
        })
      });
    } catch (e) {
      console.log(e);
    }
  })

});