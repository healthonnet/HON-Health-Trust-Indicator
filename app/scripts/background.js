'use strict';

function init() {
  // Initialise la listHON
  hon_listHON.init();
}
init();

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this;
    var args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

chrome.omnibox.onInputEntered.addListener(function(text) {
  var url = 'http://everyone.khresmoi.eu/hon-search';
  if (text) {
    url += '?start=0&fq=docType:html&group.field=domain' +
      '&overrideQ=&searchLanguage=en&q=' + encodeURIComponent(text);
  }
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.update(tab.id, {url: url});
  });
});

chrome.webRequest.onCompleted.addListener(debounce(function(details) {
  chrome.tabs.executeScript(
    details.tabId, {
      file: 'bower_components/jquery/dist/jquery.min.js',
      allFrames: true,
    }
  );
  chrome.tabs.executeScript(
    details.tabId, {
      file: 'bower_components/jquery-circle-progress/dist/circle-progress.js',
      allFrames: true,
    }
  );
  chrome.tabs.executeScript(
    details.tabId, {
      file: 'scripts/utils/tld.js',
      allFrames: true,
    }
  );
  chrome.tabs.executeScript(
    details.tabId, {
      file: 'scripts/kconnect.js',
      allFrames: true,
    }
  );
  chrome.tabs.executeScript(details.tabId, {
    file: 'scripts/contentscript.js',
    allFrames: true,
  });
}, 1000), {
  urls: [
    '*://*.google.com/*',
    '*://*.google.ch/*',
    '*://*.google.fr/*',
    '*://*.google.co.uk/*',
    '*://*.google.it/*',
    '*://*.google.bg/*',
    '*://*.google.cz/*',
    '*://*.google.dk/*',
    '*://*.google.gr/*',
    '*://*.google.ee/*',
    '*://*.google.es/*',
    '*://*.google.hr/*',
    '*://*.google.lv/*',
    '*://*.google.lt/*',
    '*://*.google.hu/*',
    '*://*.google.com.mt/*',
    '*://*.google.nl/*',
    '*://*.google.pl/*',
    '*://*.google.pt/*',
    '*://*.google.ro/*',
    '*://*.google.si/*',
    '*://*.google.sk/*',
    '*://*.google.se/*',
    '*://*.bing.com/*',
    '*://*.bing.com/*',
    '*://*.search.yahoo.com/*',
  ],
  types: ['xmlhttprequest'],
});
