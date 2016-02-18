Kconnect Chrome extension
===============

Add kconnect informations into google/yahoo/bing 's kresults
This extension also works on chromium based Opera versions (15.0+).

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
 - Unit tests (be able to test a chrome extension with moka)
 - Better Design
 - Result conditions
 - Extension options
 
Developers
-----------

 - Cedric FROSSARD

Licence
-------
Apache Licence 2.0
