'use strict';

var readabilityCallback = function(dataRdb, target) {
  if (dataRdb.readability === undefined) {
    return;
  }

  var htmlRdb =
    '<div class="k-infos readability">' +
    '<h4>Readability</h4>' +
    '<p class="hon rdb ' + dataRdb.readability.difficulty + '"></p>' +
    '<p class="desc">' +
    kconnect.config.difficultyKeyword[dataRdb.readability.difficulty] +
    '</p></div>';

  if (target.find('.readability').length === 0) {
    target.append(htmlRdb);
  }
};

var trustabilityCallback = function(data, target, link) {
  if (data.trustability === undefined) {
    return;
  }
  var trustClass;
  var trustabilityLevel =
    Math.round((data.trustability.principles.length / 9) * 100);

  if (target.siblings('.certificateLink').hasClass('valid')) {
    trustClass = 'honTrust';
  } else {
    trustClass =  'circle';
  }

  var html =
    '<div class="k-infos trustability">' +
    '<h4>Trustability</h4>' +
    '<div class="hon trb">' +
    '<a target="_blank" ' +
    'class="' + trustClass + '">' +
    '</a></div></div>';

  if (target.find('.trustability').length === 0) {
    var progress = new CircularProgress({
      radius: 25,
      strokeStyle: 'limegreen',
      lineCap: 'round',
      lineWidth: 3,
    });
    target.append(html);
    kconnect.contentHONcodeStatus(target.find('.honTrust'), link);

    target.find('.circle').html(progress.el);
    progress.update(trustabilityLevel);
  }
};


var updateLinks = function() {
  var deferred = new $.Deferred();

  // Get links
  var links = [];
  var hrefSelector = '';
  var trustabilityRequested = 0;
  // Match Google
  if (window.location.host.indexOf('google') > -1) {
    hrefSelector = 'h3.r a';
  }
  // Match Yahoo
  else if (window.location.host.indexOf('yahoo') > -1) {
    hrefSelector = 'div.compTitle h3.title a';
  }
  // Match Bing
  else if (window.location.host.indexOf('bing') > -1) {
    hrefSelector = 'li.b_algo h2 a';
  }
  var nodeList = document.querySelectorAll(hrefSelector);
  for (var i = 0; i < nodeList.length; ++i) {
    links[i] = nodeList[i].href;
  }
  links.forEach(function(link, index) {
    var $layerId;
    var $logoId;

    var honLogo = $(nodeList.item(index)).parent();
    var domain = kconnect.getDomainFromUrl(link);

    var trustabilityRequest = kconnect.getIsTrustable(domain);
    var readabilityRequest = kconnect.getReadability(link);

    var layerId = 'honLayer_' + index;
    var logoId = 'honLogo_' + index;

    var honCodeLogo = '<div target=\'_blank\' id="' + logoId +
      '" class="hon certificateLink"></div>';
    var popUp = '<div class="honPopup" style="display: none" ' +
      'id="' + layerId + '">' +
      '<div class="honPopup-header">' + domain + '</div>' +
      '</div>';

    if (honLogo.children('.certificateLink').length === 0) {
      // Normalize Search Engine parents' behaviors
      honLogo.parent().css('overflow','visible');
      honLogo.parent().css('position','relative');
      honLogo.prepend(honCodeLogo + popUp);
      kconnect.contentHONcodeStatus(honLogo.children('.certificateLink'), link);
    }

    $layerId =  $('#' + layerId);
    $logoId =  $('#' + logoId);

    $.when(trustabilityRequest, readabilityRequest)
      .then(function(trustabilityResponse, readabilityResponse) {
        readabilityCallback(readabilityResponse[0], $layerId);
        trustabilityCallback(trustabilityResponse[0], $layerId, link);

        var timeoutId;
        var hideTimeoutId;

        // Add honLogo eventListener
        $logoId.hover(function() {
          if (!timeoutId) {
            timeoutId = window.setTimeout(function() {
              timeoutId = null;
              $layerId.show();
            }, 200);
          }
        }, function() {
          if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
          }
        });

        $layerId.hover(function() {
          if (hideTimeoutId) {
            window.clearTimeout(hideTimeoutId);
            hideTimeoutId = null;
          }
        }, function() {
          if (!hideTimeoutId) {
            hideTimeoutId = window.setTimeout(function() {
              hideTimeoutId = null;
              $layerId.hide();
            }, 200);
          }
        });
      })
      .always(function() {
        trustabilityRequested++;
        if (trustabilityRequested === links.length) {
          deferred.resolve();
        }
      });
  });

  return deferred.promise();
};

updateLinks().done(function() {});
