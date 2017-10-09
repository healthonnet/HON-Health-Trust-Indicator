var kconnectTest     = 'Test Kconnect services';
var googleSearch     = 'Verify selectors in Google search results';
var yahooSearch      = 'Verify selectors in Yahoo search results';
var duckduckgoSearch = 'Verify selectors in Duckduckgo search results';
var bingSearch       = 'Verify selectors in Bing search results';

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
    return JSON.parse(trustabilityReq).trustability.score === 77;
  }, 'trustability informations found');

  test.assertEval(function() {
    var kConnectApiUrl = 'https://apikconnect.honservices.org/~kconnect/' +
      'cgi-bin/';
    var readabilityReq = __utils__.sendAJAX(
      kConnectApiUrl + 'readability.cgi?data={"url":"https://www.vidal.fr"}',
      'GET'
    );
    return JSON.parse(readabilityReq).readability.difficulty === 'easy';
  }, 'readability informations found');

  casper.run(function() {
    test.done();
  });
});

// Google
casper.test.begin(googleSearch, 0, function suite(test) {

  casper.start('http://www.google.fr/search?q=vidal', function() {
    this.waitForSelector('h3.r a');
  });

  casper.run(function() {
    test.done();
  });
});

// Yahoo
casper.test.begin(yahooSearch, 0, function suite(test) {

  casper.start('https://fr.search.yahoo.com/search?p=vidal', function() {
    this.waitForSelector('h3.title a');
  });

  casper.run(function() {
    test.done();
  });
});

// Bing
casper.test.begin(bingSearch, 0, function suite(test) {

  casper.start('http://www.bing.com/search?q=vidal', function() {
    this.waitForSelector('.b_algo h2 a');
  });

  casper.run(function() {
    test.done();
  });
});

// Duckduckgo
casper.test.begin(duckduckgoSearch, 0, function suite(test) {

  casper.start('https://duckduckgo.com/?q=vidal&t=h_&ia=web', function() {
    this.waitForSelector('h2.result__title>a.result__a');
  });

  casper.run(function() {
    test.done();
  });
});