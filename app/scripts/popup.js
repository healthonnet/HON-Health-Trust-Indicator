'use strict';

var currentTab;
var query = {active: true, currentWindow: true};
var principleList = ['Advertising policy', 'Attribution',
  'Authoritative', 'Complementarity', 'Date',
  'Financial disclosure', 'Justifiability', 'Privacy', 'Transparency',];

chrome.tabs.query(query, function(tabs) {
  currentTab = tabs[0];
  var domain = kconnect.getDomainFromUrl(currentTab.url);
  $('h1').text(chrome.i18n.getMessage('appName'));
  $('#khresmoi').text(chrome.i18n.getMessage('khresmoiTitle'));
  $('#q').attr('placeholder',
    chrome.i18n.getMessage('khresmoiPlaceholder'));
  $('#searchSubmit').val(chrome.i18n.getMessage('khresmoiSearch'));
  $('#searchLanguage').val(kconnect.config.khresmoiLanguage);
  $('#host').text(domain);
  $('#readability').text(
    chrome.i18n.getMessage('readabilityTitle').toLowerCase()
  );

  $('#about').text(chrome.i18n.getMessage('about'));
  $('#trustability-content').text(chrome.i18n.getMessage('loading'));
  $('#readability-content').text(chrome.i18n.getMessage('loading'));
  $('.readability-circle')
      .find('span')
      .append($('<i>', {
        class: 'fa fa-book',
        'aria-hidden': 'true',
      }));

  $('.auto').append(
    $('<i>', {
      class: 'fa fa-warning',
      'aria-hidden': 'true',
    })
  ).append(
    ' ' + chrome.i18n.getMessage('automatedResults')
  );
  $('#trustability').text(
    chrome.i18n.getMessage('trustabilityTitle').toLowerCase()
  );
  $('.trustability-circle')
    .find('span')
    .append($('<i>', {
      class: 'fa fa-stethoscope',
      'aria-hidden': 'true',
    }));

  var tProgress = new ProgressBar.Circle('.trustability-circle', {
    strokeWidth: 7,
    trailWidth: 7,
    trailColor: '#ddd',
  });

  var rProgress = new ProgressBar.Circle('.readability-circle', {
    strokeWidth: 7,
    trailWidth: 7,
    trailColor: '#ddd',
  });

  var readabilityRequest = kconnect.getReadability(currentTab.url);
  var trustabilityRequest = kconnect.getIsTrustable(domain);

  $.when(trustabilityRequest)
    .then(function(trustabilityResponse) {
      // Trustability Informations
      if (trustabilityResponse.trustability === undefined) {
        tProgress.destroy();
        tProgress = new ProgressBar.Circle('.trustability-circle', {
          strokeWidth: 7,
          trailWidth: 7,
          trailColor: '#ddd',
          color: 'black',
          easing: 'easeInOut',
          duration: 800,
        });
        $('.trustability-circle')
          .find('span')
          .html($('<i>', {
            class: 'fa fa-ban',
            'aria-hidden': 'true',
          }));

        $('#trustability-content').html(
          $('<p>').text(
            chrome.i18n.getMessage('popupTrustabilityNoInformation')));

        tProgress.set(1);
        return;
      }
      var principlesHtml = $('<ul>');
      var score = trustabilityResponse.trustability.score;

      principleList.forEach(
        function(principle) {
          var principleTrad = principle.replace(/[^A-Z0-9]/ig, '_');
          if (trustabilityResponse.trustability
              .principles.indexOf(principle) > -1) {
            principlesHtml.append(
            $('<li>').append(
              $('<i>', {
                class: 'fa fa-check',
                style: 'color: green',
                'aria-hidden': 'true',
              })
            ).append(chrome.i18n.getMessage(principleTrad))
            );
          } else {
            principlesHtml.append(
              $('<li>').append(
                $('<i>', {
                  class: 'fa fa-times',
                  style: 'color:red',
                  'aria-hidden': 'true',
                })
              ).append(chrome.i18n.getMessage(principleTrad))
            );
          }
        });


      var trustabilityColor = 'red';
      if (score > 33 && score <= 66) {
        trustabilityColor = 'orange';
      } else if (score > 66) {
        trustabilityColor = 'green';
      }
      tProgress.destroy();
      tProgress = new ProgressBar.Circle('.trustability-circle', {
        strokeWidth: 7,
        trailWidth: 7,
        trailColor: '#ddd',
        color: trustabilityColor,
        easing: 'easeInOut',
        duration: 800,
      });
      $('.trustability-circle').find('span').text(score);
      $('#trustability-content').html(principlesHtml);
      if (score === 0) {
        score = 100;
      }
      tProgress.animate(score / 100);

    });

  $.when(readabilityRequest)
    .then(function(readabilityResponse) {
      var difficulty = readabilityResponse.readability.difficulty;
      var readabilityColor = 'red';
      if (difficulty === 'average') {
        readabilityColor = 'orange';
      } else if (difficulty === 'easy') {
        readabilityColor = 'green';
      }
      rProgress.destroy();
      rProgress = new ProgressBar.Circle('.readability-circle', {
        strokeWidth: 7,
        trailWidth: 7,
        trailColor: '#ddd',
        color: readabilityColor,
        easing: 'easeInOut',
        duration: 800,
      });
      $('.readability-circle')
        .find('span')
        .html($('<i>', {
          class: 'fa fa-book',
          'aria-hidden': 'true',
        }));
      rProgress.animate(1);
      $('#readability-content').html(
        $('<span>').text(
          kconnect.config.difficultyKeyword[difficulty]
        )
      );
    }, function() {
      $('#readability-content').html(
        $('<p>').text(
          chrome.i18n.getMessage('popupReadabilityNoInformation')
        )
      );
      rProgress.destroy();
      rProgress = new ProgressBar.Circle('.readability-circle', {
        strokeWidth: 7,
        trailWidth: 7,
        trailColor: '#ddd',
        color: 'black',
        easing: 'easeInOut',
        duration: 800,
      });
      rProgress.set(1);

      $('.readability-circle')
        .find('span')
        .html($('<i>', {
          class: 'fa fa-ban',
          'aria-hidden': 'true',
        }));
    });
});
