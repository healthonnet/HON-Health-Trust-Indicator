var chrome = require('sinon-chrome');

var kconnectTest = 'Test Kconnect services';
var googleSearch   = 'Verify selectors in ' +
  'Google search results';
var yahooSearch    = 'Verify selectors in ' +
  'Yahoo search results';
var bingSearch     = 'Verify selectors in ' +
  ' Bing search results';

// Webservices Kconnect
casper.test.begin(kconnectTest, 2, function suite(test) {

  casper.start('http://www.google.fr/', function() {

  });

  test.assertEval(function() {
    var kConnectApiUrl = 'https://apikconnect.honservices.org/~kconnect/' +
      'cgi-bin/';
    var trustabilityReq = __utils__.sendAJAX(
      kConnectApiUrl + 'is-trustable.cgi?domain=vidal.fr',
      'GET'
    );
    return JSON.parse(trustabilityReq).trustability.score === 55;
  }, 'trustability informations found');

  test.assertEval(function() {
    var kConnectApiUrl = 'https://apikconnect.honservices.org/~kconnect/' +
      'cgi-bin/';
    var readabilityReq = __utils__.sendAJAX(
      kConnectApiUrl + 'readability.cgi?data={"url":"https://www.vidal.fr"}',
      'GET'
    );
    return JSON.parse(readabilityReq).readability.difficulty === 'difficult';
  }, 'readability informations found');

  casper.run(function() {
    test.done();
  });
});

// Google
casper.test.begin(googleSearch, 3, function suite(test) {

  casper.start('http://www.google.fr/', function() {
    test.assertExists('form[action="/search"]', 'main form is found');
    this.fill('form[action="/search"]', {
      q: 'vidal'
    }, true);

    this.waitForSelector('h3.r a');
  });

  casper.then(function() {

    // Chrome API polyfill
    this.evaluate(function(chrome) {
      chrome.i18n.getMessage = function(message) {
        return message;
      };

      window.chrome = chrome;
    }, chrome);

    this.page.injectJs('app/bower_components/jquery/dist/jquery.min.js');
    this.page.injectJs(
      'app/bower_components/circular-progress/circular-progress.min.js');
    this.page.injectJs('app/scripts/kconnect.js');
    this.page.injectJs('app/scripts/contentscript.js');

    test.assertTitle('vidal - Recherche Google', 'google title is ok');
    test.assertUrlMatch(/q=vidal/, 'search term has been submitted');
  });

  casper.run(function() {
    test.done();
  });
});

// Yahoo
casper.test.begin(yahooSearch, 4, function suite(test) {

  casper.start('https://fr.yahoo.com/', function() {
    test.assertExists(
      'form[action="https://fr.search.yahoo.com/search"]',
      'main form is found'
    );
    this.fill('form[action="https://fr.search.yahoo.com/search"]', {
      p: 'vidal'
    }, true);
    test.assertExists('input[name="p"]', 'input form is found');
    this.waitForSelector('h3.title a');
  });

  casper.then(function() {

    // Chrome API polyfill
    this.evaluate(function(chrome) {
      chrome.i18n.getMessage = function(message) {
        return message;
      };

      window.chrome = chrome;
    }, chrome);

    this.page.injectJs('app/bower_components/jquery/dist/jquery.min.js');
    this.page.injectJs(
      'app/bower_components/circular-progress/circular-progress.min.js');
    this.page.injectJs('app/scripts/kconnect.js');
    this.page.injectJs('app/scripts/contentscript.js');

    test.assertTitle('vidal - Yahoo Search - Actualités', 'yahoo title is ok');
    test.assertUrlMatch(/p=vidal/, 'search term has been submitted');
  });

  casper.run(function() {
    test.done();
  });
});

// Bing
casper.test.begin(bingSearch, 3, function suite(test) {

  casper.start('https://www.bing.com/', function() {
    test.assertExists('form[action="/search"]', 'main form is found');
    this.fill('form[action="/search"]', {
      q: 'vidal'
    }, true);
    this.waitForSelector('.b_algo h2 a');
  });

  casper.then(function() {

    // Chrome API polyfill
    this.evaluate(function(chrome) {
      chrome.i18n.getMessage = function(message) {
        return message;
      };

      window.chrome = chrome;
    }, chrome);

    this.page.injectJs('app/bower_components/jquery/dist/jquery.min.js');
    this.page.injectJs(
      'app/bower_components/circular-progress/circular-progress.min.js');
    this.page.injectJs('app/scripts/kconnect.js');
    this.page.injectJs('app/scripts/contentscript.js');

    test.assertTitle('vidal - Bing', 'bing title is ok');
    test.assertUrlMatch(/q=vidal/, 'search term has been submitted');

  });

  casper.run(function() {
    test.done();
  });
});
