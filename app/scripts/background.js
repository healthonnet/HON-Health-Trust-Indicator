'use strict';

chrome.webRequest.onCompleted.addListener(function(details) {
  chrome.tabs.executeScript(
    details.tabId, {file: 'bower_components/jquery/dist/jquery.min.js', allFrames: true}
  );
  chrome.tabs.executeScript(details.tabId, {
    file: 'scripts/contentscript.js',
    allFrames: true
  });
}, {
  urls: [
    'https://*.google.com/*',
    'https://*.google.ch/*',
    'https://*.google.fr/*',
    'https://*.google.co.uk/*',
    'https://*.google.it/*',
    'https://*.google.bg/*',
    'https://*.google.cz/*',
    'https://*.google.dk/*',
    'https://*.google.gr/*',
    'https://*.google.ee/*',
    'https://*.google.es/*',
    'https://*.google.hr/*',
    'https://*.google.lv/*',
    'https://*.google.lt/*',
    'https://*.google.hu/*',
    'https://*.google.com.mt/*',
    'https://*.google.nl/*',
    'https://*.google.pl/*',
    'https://*.google.pt/*',
    'https://*.google.ro/*',
    'https://*.google.si/*',
    'https://*.google.sk/*',
    'https://*.google.se/*',
    'https://*.bing.com/*',
    'https://*.search.yahoo.com/*'
  ],
  types: ['xmlhttprequest']
});

