'use strict';

var readabilityCallback = function(dataRdb, target, id, progress) {
  var bIsJquery = target instanceof jQuery;
  if (!bIsJquery) {
    target = $(target.selector);
  }

  if (dataRdb.error) {
    target.find('.readability-circle')
      .find('span')
      .html('<i class="fa fa-ban" aria-hidden="true"></i>');
  }

  if (dataRdb.readability === undefined) {
    return;
  }

  var difficulty = dataRdb.readability.difficulty;

  if (target.find('.rdb').length === 0) {
    var readabilityColor = 'red';
    if (difficulty === 'average') {
      readabilityColor = 'orange';
    } else if (difficulty === 'easy') {
      readabilityColor = 'green';
    }
    progress.destroy();
    progress =
    new ProgressBar.Circle(
    document.getElementById(id).querySelector('.readability-circle'), {
      strokeWidth: 7,
      trailWidth: 7,
      trailColor: '#ddd',
      color: readabilityColor,
      easing: 'easeInOut',
      duration: 800,
    });
    target.find('.readability-circle')
      .find('span')
      .html('<i class="fa fa-book" aria-hidden="true"></i>');
    progress.animate(1);
  }
};

var requestKconnect = function(event, link) {
  var domain = kconnect.getDomainFromUrl(link);
  var readabilityRequest = kconnect.getReadability(link);
  var layerId = 'layer' + event.target.id;
  var $logoId =  $(event.target);

  var fa = document.createElement('style');
  fa.type = 'text/css';
  fa.textContent = '@font-face { font-family: FontAwesome; src: url("' +
    chrome.extension.getURL('fonts/fontawesome-webfont.woff') +
  '"); }';
  document.head.appendChild(fa);

  var popUp = '<div class="kconnectPopup" style="display: none" ' +
    'id="' + layerId + '">' +
    '<div class="honPopup-header">' + domain + '</div>' +
    '<div class="k-infos trustability">' +
    '<h4>' + chrome.i18n.getMessage('trustabilityTitle') +
    '</h4><div class="trustability-circle">' +
    '<span></span></div></div>' +
    '<div class="k-infos readability">' +
    '<h4>' + chrome.i18n.getMessage('readabilityTitle') +
    '</h4><div class="readability-circle">' +
    '<span></span></div></div>';
  $('body').append(popUp);


  var $layerId =  $('#' + layerId);

  var borderX = 10;
  if (event.pageX + 290 > document.body.getBoundingClientRect().right) {
    borderX = event.pageX + 300 - document.body.getBoundingClientRect().right;
  }

  $layerId.css('left', event.pageX - borderX);
  $layerId.css('top', event.pageY - 10);

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

  var rProgress = new ProgressBar.Circle(
    document.getElementById(layerId).querySelector('.readability-circle'), {
    strokeWidth: 7,
    trailWidth: 7,
    trailColor: '#ddd',
  });
  $layerId.find('.readability-circle')
    .find('span')
    .html('<i class="fa fa-question" aria-hidden="true"></i>');

  new ProgressBar.Circle(
    document.getElementById(layerId).querySelector('.trustability-circle'), {
    strokeWidth: 7,
    trailWidth: 7,
    trailColor: '#ddd',
  });
  $layerId.find('.trustability-circle')
    .find('span')
    .html('<p class="coming-soon">' +
      chrome.i18n.getMessage('comingSoon') + '</p>');

  $.when(readabilityRequest)
    .then(function(readabilityResponse) {
      readabilityCallback(readabilityResponse, $layerId, layerId, rProgress);
    }, function(error) {
      readabilityCallback(error.responseJSON, $layerId, layerId, rProgress);
    });

  $layerId.show();
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
    hrefSelector = '#web div.compTitle h3.title>a';
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

    var logoId = 'kconnectLogo_' + index;

    var honCodeLogo = '<div target=\'_blank\' id="' + logoId +
      '" class="hon kconnectLogo"></div>';

    if (honLogo.children('.kconnectLogo').length === 0) {
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
