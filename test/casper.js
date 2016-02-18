var chrome = require('sinon-chrome');

// google
casper.test.begin('Add Readability & Trustability Information in Google search results', 5, function suite(test) {

    casper.start("http://www.google.fr/", function() {
        test.assertExists('form[action="/search"]', "main form is found");
        this.fill('form[action="/search"]', {
            q: "vidal"
        }, true);
    });

    //Debug
    casper.on("remote.message", function(message) {
        this.echo("remote console.log: " + message);
    });

    casper.then(function() {

        //Chrome API polyfill
        this.evaluate(function (chrome){
            chrome.i18n.getMessage = function (message) {
                return message;
            };

            window.chrome = chrome;
        },chrome);

        this.page.injectJs('app/bower_components/jquery/dist/jquery.min.js');
        this.page.injectJs('app/scripts/contentscript.js');

        this.evaluate(function () {
            var trustabilityReq,
                readabilityReq;
            trustabilityReq = __utils__.sendAJAX('http://api.kconnect.honservices.org/~kconnect/cgi-bin/is-trustable.cgi?domain=vidal.fr', "GET");
            readabilityReq  = __utils__.sendAJAX('http://api.kconnect.honservices.org/~kconnect/cgi-bin/readability.cgi?data={"url":"https://www.vidal.fr"}', "GET");
            trustabilityCallback(JSON.parse(trustabilityReq), $(document.querySelectorAll('h3.r a').item(1)).parent().siblings('.s'));
            readabilityCallback( JSON.parse(readabilityReq), $(document.querySelectorAll('h3.r a').item(1)).parent().siblings('.s'), "https://www.vidal.fr");
        });

        test.assertTitle("vidal - Recherche Google", "google title is ok");
        test.assertUrlMatch(/q=vidal/, "search term has been submitted");

        test.assertEval(function() {
            return __utils__.findAll(".hon.trb").length == 1;
        }, "trustability informations found");
        test.assertEval(function() {
            return __utils__.findAll(".hon.rdb").length == 1;
        }, "readability informations found");

    });

    casper.run(function() {
        test.done();
    });
});