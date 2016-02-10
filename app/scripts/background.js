'use strict';

console.log('\'Allo \'Allo! Event Page');

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});



chrome.webRequest.onCompleted.addListener(function(details) {
  chrome.tabs.executeScript(details.tabId, {
    file: 'contentscript.js',
    allFrames: true
  });
}, {
  urls: ['http://google.*/*'],
  types: ['xmlhttprequest']
});

