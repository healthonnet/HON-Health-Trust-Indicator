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
    '*://*.google.ac/*',
    '*://*.google.ad/*',
    '*://*.google.ae/*',
    '*://*.google.com.af/*',
    '*://*.google.com.ag/*',
    '*://*.google.com.ai/*',
    '*://*.google.al/*',
    '*://*.google.am/*',
    '*://*.google.co.ao/*',
    '*://*.google.com.ar/*',
    '*://*.google.as/*',
    '*://*.google.at/*',
    '*://*.google.com/au/*',
    '*://*.google.az/*',
    '*://*.google.ba/*',
    '*://*.google.com.bd/*',
    '*://*.google.be/*',
    '*://*.google.bf/*',
    '*://*.google.bg/*',
    '*://*.google.com.bh/*',
    '*://*.google.bi/*',
    '*://*.google.bj/*',
    '*://*.google.com.bn/*',
    '*://*.google.com.bo/*',
    '*://*.google.bs/*',
    '*://*.google.bt/*',
    '*://*.google.co.bw/*',
    '*://*.google.by/*',
    '*://*.google.com.bz/*',
    '*://*.google.ca/*',
    '*://*.google.com.kh/*',
    '*://*.google.cc/*',
    '*://*.google.cd/*',
    '*://*.google.cf/*',
    '*://*.google.cat/*',
    '*://*.google.cg/*',
    '*://*.google.ch/*',
    '*://*.google.ci/*',
    '*://*.google.co.ck/*',
    '*://*.google.cl/*',
    '*://*.google.cm/*',
    '*://*.google.cn/*',
    '*://*.google.com.co/*',
    '*://*.google.co.cr/*',
    '*://*.google.com.cu/*',
    '*://*.google.cv/*',
    '*://*.google.com.cy/*',
    '*://*.google.cz/*',
    '*://*.google.de/*',
    '*://*.google.dj/*',
    '*://*.google.dk/*',
    '*://*.google.dm/*',
    '*://*.google.com.do/*',
    '*://*.google.dz/*',
    '*://*.google.com.ec/*',
    '*://*.google.ee/*',
    '*://*.google.com.eg/*',
    '*://*.google.es/*',
    '*://*.google.com.et/*',
    '*://*.google.fi/*',
    '*://*.google.fj/*',
    '*://*.google.fm/*',
    '*://*.google.fr/*',
    '*://*.google.ga/*',
    '*://*.google.ge/*',
    '*://*.google.gf/*',
    '*://*.google.gg/*',
    '*://*.google.com.gh/*',
    '*://*.google.com.gi/*',
    '*://*.google.gl/*',
    '*://*.google.gm/*',
    '*://*.google.gp/*',
    '*://*.google.gr/*',
    '*://*.google.com.gt/*',
    '*://*.google.gy/*',
    '*://*.google.com.hk/*',
    '*://*.google.hn/*',
    '*://*.google.hr/*',
    '*://*.google.ht/*',
    '*://*.google.hu/*',
    '*://*.google.co.id/*',
    '*://*.google.im/*',
    '*://*.google.co.in/*',
    '*://*.google.io/*',
    '*://*.google.is/*',
    '*://*.google.it/*',
    '*://*.google.je/*',
    '*://*.google.com.jm/*',
    '*://*.google.jo/*',
    '*://*.google.co.jp/*',
    '*://*.google.co.ke/*',
    '*://*.google.ki/*',
    '*://*.google.kg/*',
    '*://*.google.co.kr/*',
    '*://*.google.com.kw/*',
    '*://*.google.kz/*',
    '*://*.google.la/*',
    '*://*.google.com.lb/*',
    '*://*.google.com.lc/*',
    '*://*.google.li/*',
    '*://*.google.lk/*',
    '*://*.google.co.ls/*',
    '*://*.google.lt/*',
    '*://*.google.lu/*',
    '*://*.google.lv/*',
    '*://*.google.com.ly/*',
    '*://*.google.co.ma/*',
    '*://*.google.md/*',
    '*://*.google.me/*',
    '*://*.google.mg/*',
    '*://*.google.mk/*',
    '*://*.google.ml/*',
    '*://*.google.com.mm/*',
    '*://*.google.mn/*',
    '*://*.google.ms/*',
    '*://*.google.com.mt/*',
    '*://*.google.mu/*',
    '*://*.google.mv/*',
    '*://*.google.mw/*',
    '*://*.google.com.mx/*',
    '*://*.google.com.my/*',
    '*://*.google.co.mz/*',
    '*://*.google.com.na/*',
    '*://*.google.ne/*',
    '*://*.google.nf/*',
    '*://*.google.ng/*',
    '*://*.google.com.ni/*',
    '*://*.google.nl/*',
    '*://*.google.no/*',
    '*://*.google.com.np/*',
    '*://*.google.nr/*',
    '*://*.google.nu/*',
    '*://*.google.co.nz/*',
    '*://*.google.com.om/*',
    '*://*.google.com.pk/*',
    '*://*.google.com.pa/*',
    '*://*.google.com.pe/*',
    '*://*.google.com.ph/*',
    '*://*.google.pl/*',
    '*://*.google.com.pg/*',
    '*://*.google.pn/*',
    '*://*.google.com.pr/*',
    '*://*.google.ps/*',
    '*://*.google.pt/*',
    '*://*.google.com.py/*',
    '*://*.google.com.qa/*',
    '*://*.google.ro/*',
    '*://*.google.rs/*',
    '*://*.google.ru/*',
    '*://*.google.rw/*',
    '*://*.google.com.sa/*',
    '*://*.google.com.sb/*',
    '*://*.google.sc/*',
    '*://*.google.se/*',
    '*://*.google.com.sg/*',
    '*://*.google.sh/*',
    '*://*.google.si/*',
    '*://*.google.sk/*',
    '*://*.google.com.sl/*',
    '*://*.google.sn/*',
    '*://*.google.sm/*',
    '*://*.google.so/*',
    '*://*.google.st/*',
    '*://*.google.sr/*',
    '*://*.google.com.sv/*',
    '*://*.google.td/*',
    '*://*.google.tg/*',
    '*://*.google.co.th/*',
    '*://*.google.com.tj/*',
    '*://*.google.tk/*',
    '*://*.google.tl/*',
    '*://*.google.tm/*',
    '*://*.google.to/*',
    '*://*.google.tn/*',
    '*://*.google.com.tr/*',
    '*://*.google.tt/*',
    '*://*.google.com.tw/*',
    '*://*.google.co.tz/*',
    '*://*.google.com.ua/*',
    '*://*.google.co.ug/*',
    '*://*.google.co.uk/*',
    '*://*.google.us/*',
    '*://*.google.com.uy/*',
    '*://*.google.co.uz/*',
    '*://*.google.com.vc/*',
    '*://*.google.co.ve/*',
    '*://*.google.vg/*',
    '*://*.google.co.vi/*',
    '*://*.google.com.vn/*',
    '*://*.google.vu/*',
    '*://*.google.ws/*',
    '*://*.google.co.za/*',
    '*://*.google.co.zm/*',
    '*://*.google.co.zw/*',
    '*://*.bing.com/*',
    '*://*.search.yahoo.com/*',
    '*://*.wikipedia.org/*',
    '*://*.nlm.nih.gov/medlineplus/*'
  ],
  types: ['xmlhttprequest'],
});
