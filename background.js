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
    id: "skip-history",
    title: "Skip this website from chrome-history",
    contexts: ["all"],
  });

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
        setVal('incognito-list', true);
      }
      else if (info.menuItemId == "skip-history") {
        setVal('skip-history-list');
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

  /**
   * handles the action of the add-on
   * when the tab is updated
   */
  chrome.tabs.onUpdated.addListener(() => {
    //getting the present url
    try {
      chrome.tabs.getSelected(null, function (tab) {

        chrome.storage.local.get('skip-history-list', (res) => {
          res = res['skip-history-list'];
          console.log('skip-history-list', res);
          for (var i in res) {
            if (res[i] == getBaseUrl(tab.url)) {
              chrome.history.deleteUrl({ url: tab.url });
              console.log("clearing " + tab.url);
            }
          }
        })

        chrome.storage.local.get('incognito-list', (res) => {
          res = res['incognito-list'];
          console.log('incognito-list', res);
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