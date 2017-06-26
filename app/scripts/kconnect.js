'use strict';

var kconnect = {
  config: {
    difficultyKeyword: {
      easy: chrome.i18n.getMessage('tooltipReadabilityEasy'),
      average: chrome.i18n.getMessage('tooltipReadabilityAverage'),
      difficult: chrome.i18n.getMessage('tooltipReadabilityDifficult'),
    },
    khresmoiLanguage: 'en',
  },
  getDomainFromUrl: function(link) {
    var domain = tldjs.getDomain(link);
    var subdomain = tldjs.getSubdomain(link);
    if (subdomain === 'www') {
      subdomain = '';
    }

    return subdomain !== '' ? subdomain + '.' + domain : domain;
  },
  getIsTrustable: function(domain) {
    return $.get('https://apikconnect.honservices.org/' +
      '~kconnect/cgi-bin/is-trustable.cgi?domain=' + domain);
  },
  getReadability: function(link) {
    return $.get('https://apikconnect.honservices.org/' +
      '~kconnect/cgi-bin/get-readability.cgi?url=' + link);
  },
  getMissingPrinciples: function(principles) {
    var missingPrinciples = [];
    kconnect.config.honCodeCompliance.forEach(function(element) {
      if (principles.indexOf(element) < 0) {
        missingPrinciples.push(element);
      }
    });
    return missingPrinciples;
  },
};
