'use strict';

var readabilityCallback = function(dataRdb, target, link) {
  if (dataRdb.readability === undefined) {
    return;
  }

  var htmlRdb =
    '<a class="hon rdb ' + dataRdb.readability.difficulty +
    ' " href="' + link + '">' +
    '<span class="tooltip">' +
    kconnect.config.difficultyKeyword[dataRdb.readability.difficulty] +
    '</span>' +
    '</a>';
  if (target.children('.rdb').length === 0) {
    target.prepend(htmlRdb);
  }
};

var trustabilityCallback = function(data, target) {
  if (data.trustability === undefined) {
    return;
  }

  var tooltip = chrome.i18n.getMessage('tooltipTrustabilityLevel');
  var trustabilityLevel =
    Math.round((data.trustability.principles.length / 9) * 100);

  tooltip = tooltip.replace(/%VALUE%/g, trustabilityLevel);
  var principles = data.trustability.principles;
  // If some HONCode are missing we found them.
  if (trustabilityLevel !== 100) {
    tooltip += '</br>' +
      chrome.i18n.getMessage('tooltipTrustabilityMissingPrinciples');

    var missingPrinciples =
      kconnect.getMissingPrinciples(principles).join(', ');

    tooltip = tooltip.replace(/%PRINCIPLES%/g, missingPrinciples);
  }

  var html =
    '<div class="hon trb">' +
    '<span class="tooltip">' +
    tooltip +
    '</span>' +
    '<span class="meter" style=" width: ' + trustabilityLevel + '%"> </span>' +
    '</div>';
  if (target.children('.trb').length === 0) {
    target.prepend(html);
  }
};


var updateLinks = function() {
  var deferred = new $.Deferred();

  // Get links
  var links = [];
  var hrefSelector = '';
  var targetSelector = '';
  var trustabilityRequested = 0;
  // Match Google
  if (window.location.host.indexOf('google') > -1) {
    hrefSelector = 'h3.r a';
    targetSelector = '.s';
  }
  // Match Yahoo
  else if (window.location.host.indexOf('yahoo') > -1) {
    hrefSelector = 'div.compTitle h3.title a';
    targetSelector = 'div:first';
  }
  // Match Bing
  else if (window.location.host.indexOf('bing') > -1) {
    hrefSelector = 'li.b_algo h2 a';
    targetSelector = 'div.b_caption';
  }
  var nodeList = document.querySelectorAll(hrefSelector);
  for (var i = 0; i < nodeList.length; ++i) {
    links[i] = nodeList[i].href;
  }
  links.forEach(function(link, index) {
    var target = $(nodeList.item(index)).parent().siblings(targetSelector);

    var domain = kconnect.getDomainFromUrl(link);

    var trustabilityRequest = kconnect.getIsTrustable(domain);
    var readabilityRequest = kconnect.getReadability(link);

    $.when(trustabilityRequest, readabilityRequest)
      .then(function(trustabilityResponse, readabilityResponse) {
        trustabilityCallback(trustabilityResponse[0], target);
        readabilityCallback(readabilityResponse[0], target, link);
      })
      .always(function() {
        if (target.children('.hon').length !== 2) {
          target.children('.hon').hide();
        }

        trustabilityRequested++;
        if (trustabilityRequested === links.length) {
          deferred.resolve();
        }
      });
  });
  return deferred.promise();
};

updateLinks().done(function() {
  console.log('hon-kconnect-chrome-extension');
});
