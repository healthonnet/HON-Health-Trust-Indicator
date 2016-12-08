Health Trust Indicator
======================

[![Build Status](https://travis-ci.org/healthonnet/hon-kconnect-chrome-extension.svg?branch=master)](https://travis-ci.org/healthonnet/hon-kconnect-chrome-extension)

Add kconnect informations into google/yahoo/bing 's results


Browser Compatibilies
-----
 - Chrome (18+)
 - chromium based Opera versions (15.0+).
 - Firefox - (46.0+) checkout [WebExtensions-API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions). Rename and use manifest.firefox.json file.

Development Prerequisites
-----
Casperjs is used for integration testing. In order to run it you need :
 - [Python](https://www.python.org/)  2.6 or greater for casperjs in the bin/ directory

Build
-----

```bash
$ npm install
```

Test
----

```bash
$ npm test
```

Run
---

```bash
$ gulp
```

Or you can use watch task to update source continuously

```bash
$ gulp watch
```

Enable extension on Chrome
-------------

 - Go to Settings ==> Extensions
 - Enable Developer mode
 - load unpacked extension...
 - select /path/to/extension/dist

Usage
-----

There are 3 features:
 - Get readability ~~and trustability~~ in search engines;
 - Get readability ~~and trustability~~ from the webpage you are watching;
 - Type ```kconnect``` in the omnibox bar in Google Chrome and search information with khresmoi search engine.

TODO
-----------
 - [ ] Support more languages
 - [ ] Enable user specified language for search engine


Developers
-----------

 - Cedric FROSSARD
 - Pierre REPETTO-ANDIPATIN
 - William BELLE

License
-------
Apache Licence 2.0
