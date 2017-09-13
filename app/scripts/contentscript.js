'use strict';

var readabilityCallback = function(dataRdb, target, id, progress) {
  var bIsJquery = target instanceof jQuery;
  if (!bIsJquery) {
    target = $(target.selector);
  }

  if (dataRdb.error || dataRdb.readability === undefined) {
    progress.destroy();
    progress =
      new ProgressBar.Circle(
        document.getElementById(id).querySelector('.readability-circle'), {
          strokeWidth: 7,
          trailWidth: 7,
          trailColor: '#ddd',
          color: 'orange',
          easing: 'easeInOut',
          duration: 800,
        });

    target.find('.readability')
      .find('span')
      .html($('<i>', {
        class: 'fa fa-ban',
        'aria-hidden': 'true',
      }));

    progress.set(1);
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

    target.find('.readability')
      .find('span')
      .html($('<i>', {
        class: 'fa fa-book',
        'aria-hidden': 'true',
      }));

    try {
      progress.animate(1);
    } catch (e) {
      progress.set(1);
    }

  }
};

var trustabilityCallback = function(data, target, id, progress) {
  if (data.error || data.trustability === undefined) {
    progress.destroy();
    progress =
      new ProgressBar.Circle(
        document.getElementById(id).querySelector('.trustability-circle'), {
          strokeWidth: 7,
          trailWidth: 7,
          trailColor: '#ddd',
          color: 'orange',
          easing: 'easeInOut',
          duration: 800,
        });
    target.find('.trustability')
      .find('span')
      .html($('<i>', {
        class: 'fa fa-ban',
        'aria-hidden': 'true',
      }));
    progress.set(1);
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
      trustabilityColor = 'green';
    }
    progress.destroy();
    progress =
      new ProgressBar.Circle(
        document.getElementById(id).querySelector('.trustability-circle'), {
          strokeWidth: 7,
          trailWidth: 7,
          trailColor: '#ddd',
          color: trustabilityColor,
          easing: 'easeInOut',
          duration: 800,
        });
    target.find('.trustability-circle')
      .find('span')
      .html($('<i>', {
        class: 'fa fa-stethoscope',
        'aria-hidden': 'true',
      }));
    if (score === 0) {
      score = 100;
    }
    try {
      progress.animate(score / 100);
    } catch (e) {
      progress.set(score / 100);
    }
  }
};


var requestKconnect = function(event, link) {
  var domain = kconnect.getDomainFromUrl(link);
  var trustabilityRequest = kconnect.getIsTrustable(domain);
  var readabilityRequest = kconnect.getReadability(link);
  var layerId = 'layer' + event.target.id;
  var $logoId =  $(event.target);

  var fa = document.createElement('style');
  fa.type = 'text/css';
  fa.textContent = '@font-face { font-family: FontAwesome; src: url("' +
    chrome.extension.getURL('fonts/fontawesome-webfont.woff') +
  '"); }';
  document.head.appendChild(fa);

  var popUp = $('<div>', {
    class: 'kconnectPopup',
    style: 'display: none',
    id: layerId,
  }).append($('<div>', {
    class: 'honPopup-header',
  }).text(domain))
    .append($('<div>',{
      class: 'k-infos trustability',
    }).append($('<h4>').text(chrome.i18n.getMessage('trustabilityTitle')))
      .append($('<div>', {
        class: 'trustability-circle',
      }).append($('<span>'))))
    .append($('<div>',{
      class: 'k-infos readability',
    }).append($('<h4>').text(chrome.i18n.getMessage('readabilityTitle')))
      .append($('<div>', {
        class: 'readability-circle',
      }).append($('<span>'))))
    .append($('<div>',{
      class: 'honPopup-footer',
    }).append(
      $('<a>', {
        href: "https://search.kconnect.eu/beta/extension",
        target: "_blank",
      }).text(chrome.i18n.getMessage('about'))
    ));

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
  $layerId.find('.readability')
    .find('span')
    .append(
      $('<i>', {
        class: 'fa fa-question',
        'aria-hidden': 'true',
      })
    );

  var tProgress = new ProgressBar.Circle(
    document.getElementById(layerId).querySelector('.trustability-circle'), {
    strokeWidth: 7,
    trailWidth: 7,
    trailColor: '#ddd',
  });
  $layerId.find('.trustability')
    .find('span')
    .append(
      $('<i>', {
        class: 'fa fa-question',
        'aria-hidden': 'true',
      })
    );

  $.when(trustabilityRequest)
    .then(function(trustabilityResponse) {
      trustabilityCallback(trustabilityResponse, $layerId, layerId, tProgress);
    });

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

  /**
   * Yahoo has inserted a track link on each results
   * so we cannot use the target url for testing
  // Match Yahoo
  else if (window.location.host.indexOf('yahoo') > -1) {
    hrefSelector = '#web div.compTitle h3.title>a';
  }
  */

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

    var honCodeLogo = $('<div>', {
        target: '_blank',
        id: logoId,
        class: 'hon kconnectLogo',
      });

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
