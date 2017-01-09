var googleSearch   = 'Verify selectors in ' +
  'Google search results';
var yahooSearch    = 'Verify selectors in ' +
  'Yahoo search results';
var bingSearch     = 'Verify selectors in ' +
  ' Bing search results';

// Google
casper.test.begin(googleSearch, 2, function suite(test) {

  casper.start('http://www.google.fr/', function() {
    test.assertExists('form[action="/search"]', 'main form is found');
    this.fill('form[action="/search"]', {
      q: 'vidal'
    }, true);

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
casper.test.begin(yahooSearch, 3, function suite(test) {

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
    test.assertUrlMatch(/p=vidal/, 'search term has been submitted');
  });

  casper.run(function() {
    test.done();
  });
});

// Bing
casper.test.begin(bingSearch, 2, function suite(test) {

  casper.start('https://www.bing.com/', function() {
    test.assertExists('form[action="/search"]', 'main form is found');
    this.fill('form[action="/search"]', {
      q: 'vidal'
    }, true);
    this.waitForSelector('.b_algo h2 a');
  });

  casper.then(function() {
    test.assertUrlMatch(/q=vidal/, 'search term has been submitted');
  });

  casper.run(function() {
    test.done();
  });
});
