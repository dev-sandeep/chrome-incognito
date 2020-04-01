function addTable(elementId, storageId) {
  let incognitoId = document.getElementById(elementId);
  var elementStr = `
  <table class="table table-striped table-dark">
  `;

  chrome.storage.local.get(storageId, (res) => {
    res = res[storageId];
    for (var elem in res) {
      elementStr += `
      <tr>
        <td>
          <button class="btn btn-outline-light btn-sm remove-btn" type='${storageId}' url='${res[elem]}'>
            x
          </button>
          <span>&nbsp;&nbsp; ${res[elem]}</span>
        </td>
      </tr>
  `;
    }

    if(!elem){
      elementStr += `<tr><td>Nothing added in ${storageId} list</td></tr>`;
    }

    elementStr += `
    </table>
  `;
    incognitoId.innerHTML = elementStr;
  });
}

function init() {
  addTable('incognito-tbl', 'incognito-list');
  addTable('history-tbl', 'skip-history-list');
  setTimeout(function () {
    addEventListeners();
  }, 100);
}

init();

function addEventListeners() {
  var classBtn = document.getElementsByClassName('remove-btn');
  for (var i = 0; i < classBtn.length; i++) {
    (function (index) {
      classBtn[index].addEventListener("click", function () {
        console.log("Clicked index: ", classBtn[index].getAttribute('url'), classBtn[index].getAttribute('type'));
        let storageId = classBtn[index].getAttribute('type');
        try {
          chrome.storage.local.get(storageId, (res) => {
            let list = res[storageId];
            console.log(list);
            removeEntry(storageId, list, classBtn[index].getAttribute('url'));
          });
        } catch (e) {
          console.warn(e);
        }
      })
    })(i);
  }
}

function removeEntry(storageId, list, val) {
  let finalRes = list.filter((res) => res != val);

  var obj = {};
  obj[storageId] = finalRes;
  chrome.storage.local.set(obj, function () {
    console.log(finalRes + ' removed from ' + storageId);
    init();
  });
}