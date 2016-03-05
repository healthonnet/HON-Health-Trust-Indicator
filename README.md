Kconnect Chrome extension
===============

[![Build Status](https://travis-ci.org/healthonnet/hon-kconnect-chrome-extension.svg?branch=master)](https://travis-ci.org/healthonnet/hon-kconnect-chrome-extension)

Add kconnect informations into google/yahoo/bing 's results


Browser Compatibilies
-----
 - Chrome (18+)
 - chromium based Opera versions (15.0+).
 - Firefox - Nightly build (45.0+) checkout [WebExtensions-API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions). Rename and use manifest.json.firefox file.

Development Prerequisites
-----
Casperjs is used for integration testing. In order to run it you need :
 - [PhantomJS](http://phantomjs.org)  1.9.1 or greater. [Please read the installation instructions for PhantomJS](http://phantomjs.org/download.html)
 - [Python](https://www.python.org/)  2.6 or greater for casperjs in the bin/ directory

Build
-----

```bash
$ npm install
$ bower install
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
 - select /path/to/extension/app

TODO
-----------
 - Better Design
 - Extension options
 - PopUp for current website R&T informations (in progress)

Developers
-----------

 - Cedric FROSSARD
 - Pierre REPETTO-ANDIPATIN

Licence
-------
Apache Licence 2.0
