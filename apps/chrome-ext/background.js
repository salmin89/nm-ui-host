console.log('ext id: ', chrome.runtime.id);

let appName;
// appName = "com.company.neutralino";
appName = "com.company.electron";
//  appName = "com.company.nodejs";
// appName = "com.company.wrapper";

const port = chrome.runtime.connectNative(appName);

port.onMessage.addListener((response) => {
  console.log('response', response);
});

port.postMessage({a: 'a'});

chrome.action.onClicked.addListener((tab) => {
  console.log('posting to', appName)
  port.postMessage({b: 'b'});
  // port.postMessage(new Array(10));
});