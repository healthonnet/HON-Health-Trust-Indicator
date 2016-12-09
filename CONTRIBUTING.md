Contributing
============

Welcome, so you are thinking about contributing to Health Trust Indicator ?
Awesome, this a great place to start.

Setup
-----

You need to have Node.js 5.X.X.

Casperjs is used for integration testing. In order to run it you need :
 - [Python](https://www.python.org/)  2.6 or greater for Casperjs in the bin/ directory

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
--------------------------

 - Go to Settings ==> Extensions
 - Enable Developer mode
 - Load unpacked extension ...
 - Select /path/to/extension/dist

TODO
-----------
 - [ ] Support more languages
 - [ ] Enable user specified language for search engine

License
-------
Apache License 2.0
