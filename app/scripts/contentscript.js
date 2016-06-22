'use strict';

var readabilityCallback = function(dataRdb, target) {
  if (dataRdb.readability === undefined) {
    return;
  }

  var difficulty = dataRdb.readability.difficulty;

  var bIsJquery = target instanceof jQuery;
  if (!bIsJquery) {
    target = $(target.selector);
  }

  var htmlRdb =
    '<p class="hon rdb ' + difficulty + '"></p>' +
    '<p class="desc">' +
    kconnect.config.difficultyKeyword[difficulty] +
    '</p>';

  if (target.find('.rdb').length === 0) {
    var readabilityColor = 'red';
    var readabilityScore = 0.33;
    if (difficulty === 'average') {
      readabilityColor = 'orange';
      readabilityScore = 0.66;
    } else if (difficulty === 'easy') {
      readabilityColor = 'lime';
      readabilityScore = 1;
    }
    target.find('.readability-circle').circleProgress({
      value: readabilityScore,
      animation: true,
      fill: {
        color: readabilityColor,
      },
    });
  }
};

var trustabilityCallback = function(data, target, link) {
  if (data.trustability === undefined) {
    return;
  }

  var bIsJquery = target instanceof jQuery;
  if (!bIsJquery) {
    target = $(target.selector);
  }

  var score = data.trustability.score;

  if (target.find('.trb').length === 0) {

    var trustabilityColor = 'red';
    if (score > 33 && score <= 66) {
      trustabilityColor = 'orange';
    } else if (score > 66) {
      trustabilityColor = 'lime';
    }
    target.find('.trustability-circle').circleProgress({
      value: (score / 100),
      animation: true,
      fill: {
        color: trustabilityColor,
      },
    });
  }
};

var requestKconnect = function(event, link) {
  var domain = kconnect.getDomainFromUrl(link);
  var trustabilityRequest = kconnect.getIsTrustable(domain);
  var readabilityRequest = kconnect.getReadability(link);
  var layerId = 'layer' + event.target.id;
  var $logoId =  $(event.target);

  var popUp = '<div class="honPopup" style="display: none" ' +
    'id="' + layerId + '">' +
    '<div class="honPopup-header">' + domain + '</div>' +
    '<div class="k-infos readability">' +
    '<h4>Readability</h4><div class="readability-circle">' +
    '<span></span></div></div>' +
    '<div class="k-infos trustability">' +
    '<h4>Trustability</h4><div class="trustability-circle">' +
    '<span></span></div></div>';
  $logoId.parent().append(popUp);


  var $layerId =  $('#' + layerId);
  $layerId.css('left', event.target.offsetLeft -10);

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

  $layerId.find('.readability-circle').circleProgress({
    value: 0,
    size: 70,
    animation: false,
  });
  $layerId.find('.readability-circle')
    .find('span')
    .html('<i class="fa fa-book" aria-hidden="true"></i>');

  $layerId.find('.trustability-circle').circleProgress({
    value: 0,
    size: 70,
    animation: false,
  });
  $layerId.find('.trustability-circle')
    .find('span')
    .html('<i class="fa fa-stethoscope" aria-hidden="true"></i>');

  $layerId.show();

  $.when(trustabilityRequest)
    .then(function(trustabilityResponse) {
      trustabilityCallback(trustabilityResponse, $layerId, link);
    });

  $.when(readabilityRequest)
    .then(function(readabilityResponse) {
      readabilityCallback(readabilityResponse, $layerId);
    });
};

var updateLinks = function() {
  var deferred = new $.Deferred();

  // Get links
  var links = [];
  var hrefSelector = '';
  var trustabilityRequested = 0;
  // Match Google
  if (window.location.host.indexOf('google') > -1) {
    hrefSelector = 'h3.r>a';
  }
  // Match Yahoo
  else if (window.location.host.indexOf('yahoo') > -1) {
    hrefSelector = 'div.compTitle h3.title>a';
  }
  // Match Bing
  else if (window.location.host.indexOf('bing') > -1) {
    hrefSelector = 'li.b_algo h2>a';
  }
  var nodeList = document.querySelectorAll(hrefSelector);
  for (var i = 0; i < nodeList.length; ++i) {
    links[i] = nodeList[i].href;
  }
  links.forEach(function(link, index) {
    var honLogo = $(nodeList.item(index)).parent();

    var logoId = 'honLogo_' + index;

    var honCodeLogo = '<div target=\'_blank\' id="' + logoId +
      '" class="hon certificateLink"></div>';

    if (honLogo.children('.certificateLink').length === 0) {
      // Normalize Search Engine parents' behaviors
      honLogo.parent().css('overflow','visible');
      honLogo.parent().css('position','relative');
      honLogo.append(honCodeLogo);

      // Add onClick listener
      $('#' + logoId).one('click', function(e) {
        requestKconnect(e, link);
      });
    }

    trustabilityRequested++;
    if (trustabilityRequested === links.length) {
      deferred.resolve();
    }
  });

  return deferred.promise();
};

updateLinks().done(function() {});
