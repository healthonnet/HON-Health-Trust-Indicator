'use strict';

console.log('\'Allo \'Allo! Event Page');

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});



chrome.webRequest.onCompleted.addListener(function(details) {
  chrome.tabs.executeScript(
      details.tabId, {file: 'bower_components/jquery/dist/jquery.min.js', allFrames: true}
  );
  chrome.tabs.executeScript(details.tabId, {
    file: 'scripts/contentscript.js',
    allFrames: true
  });
}, {
  urls: ['https://*/*'],
  types: ['xmlhttprequest']
});

