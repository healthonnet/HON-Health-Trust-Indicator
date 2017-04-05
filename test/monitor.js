var googleSearch   = 'Verify selectors in ' +
  'Google search results';
var yahooSearch    = 'Verify selectors in ' +
  'Yahoo search results';
var bingSearch     = 'Verify selectors in ' +
  ' Bing search results';

// Google
casper.test.begin(googleSearch, 1, function suite(test) {

  casper.start('http://www.google.fr/search?q=vidal', function() {
    this.waitForSelector('h3.r a');
  });

  casper.then(function() {
    test.assertUrlMatch(/q=vidal/, 'search term has been submitted');
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