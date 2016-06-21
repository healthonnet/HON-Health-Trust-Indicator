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
  getSiteJabber: function(domain) {
    return $.get('https://api.sitejabber.com/v1/businesses/' +
      domain + '?client_token=8fa1c56da719de8f352c105bd654ca8061a58be3');
  },
  getReadability: function(link) {
    return $.get('https://apikconnect.honservices.org/' +
      '~kconnect/cgi-bin/readability.cgi?data={\"url\":\"' + link + '\"}');
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
  contentHONcodeStatus: function(target, link) {
    hon_listHON.checkURL(hon_listHON.formatHREF(link)).then(function(code) {
      var HONcodeCertificateLink = code;
      var langue = navigator.language.substring(0,2);

      if (HONcodeCertificateLink === '' ||
        HONcodeCertificateLink === undefined) {
        target.title = 'No HonCode certification';
        target.addClass('invalid');
      } else {
        target.attr('title', 'HonCode certified');
        target.addClass('valid');
        target.attr('href',
          'http://services.hon.ch/cgi-bin/Plugin/redirect.pl?' +
          HONcodeCertificateLink + ' +' + langue);
      }
    });
  },

};
