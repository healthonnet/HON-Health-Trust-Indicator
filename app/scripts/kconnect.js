'use strict';

var kconnect = {
  config: {
    difficultyKeyword: {
      easy: chrome.i18n.getMessage('tooltipReadabilityEasy'),
      average: chrome.i18n.getMessage('tooltipReadabilityAverage'),
      difficult: chrome.i18n.getMessage('tooltipReadabilityDifficult'),
    },
    honCodeCompliance: [
      'Advertising policy',
      'Attribution',
      'Authoritative',
      'Complementarity',
      'Date',
      'Financial disclosure',
      'Justificability',
      'Privacy',
      'Transparency',
    ],
  },
  getDomainFromUrl: function(link) {
    return tldjs.getDomain(link);
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
  displayHONcodeStatus: function(link) {
    hon_listHON.checkURL(link).then(function(code){
      var HONcodeCertificateLink = code;
      var icon = document.getElementById('honstatus');
      var certificate = document.getElementById('certificateLink');
      var langue = navigator.language.substring(0,2);

      if (HONcodeCertificateLink == '' || HONcodeCertificateLink == undefined) {
        icon.src = 'images/honcode/hon-invalid-large.png';
      } else {
        icon.src = 'images/honcode/hon-valid-large.png';
        certificate.href = 'http://services.hon.ch/cgi-bin/Plugin/redirect.pl?' +
          HONcodeCertificateLink + ' +' + langue;
      }
    });
  },

};
