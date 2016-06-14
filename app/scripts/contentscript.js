'use strict';

var readabilityCallback = function(dataRdb, target, link) {
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

  if (target.children('.readability').length === 0) {
    target.append(htmlRdb);
  }
};

var trustabilityCallback = function(data, target) {
  if (data.trustability === undefined) {
    return;
  }

  var trustabilityLevel =
    Math.round((data.trustability.principles.length / 9) * 100);

  var html =
    '<div class="k-infos trustabilty">' +
    '<h4>Trustabilty</h4>' +
    '<div class="hon trb">' +
    '<div class="circle">' +
    '</div>' +
    '</div>' +
    '</div>';

  if (target.children('.trustabilty').length === 0) {
    var progress = new CircularProgress({
      radius: 25,
      strokeStyle: 'limegreen',
      lineCap: 'round',
      lineWidth: 3,
    });
    target.append(html);
    target.find('.circle').html(progress.el);
    progress.update(trustabilityLevel);
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
    var $layerId;
    var $logoId;

    var target = $(nodeList.item(index)).parent().siblings(targetSelector);
    var honLogo = $(nodeList.item(index)).parent();
    var domain = kconnect.getDomainFromUrl(link);

    var trustabilityRequest = kconnect.getIsTrustable(domain);
    var readabilityRequest = kconnect.getReadability(link);

    var layerId = 'honLayer_' + index;
    var logoId = 'honLogo_' + index;

    var honCodeLogo = '<a target=\'_blank\' id="' + logoId +
      '" class="hon certificateLink"></a>';
    var popUp = '<div class="honPopup" style="display: none" ' +
      'id="' + layerId + '">' +
      '<div class="honPopup-header">' + domain + '</div>' +
      '</div>';

    if (honLogo.children('.certificateLink').length === 0) {
      honLogo.prepend(honCodeLogo + popUp);
      kconnect.contentHONcodeStatus(honLogo.children('.certificateLink'), link);
    }

    $layerId =  $('#' + layerId);
    $logoId =  $('#' + logoId);

    $.when(trustabilityRequest, readabilityRequest)
      .then(function(trustabilityResponse, readabilityResponse) {
        readabilityCallback(readabilityResponse[0], $layerId, link);
        trustabilityCallback(trustabilityResponse[0], $layerId);

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
