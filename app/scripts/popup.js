'use strict';

var currentTab;
var query = {active: true, currentWindow: true};

chrome.tabs.query(query, function(tabs) {
  currentTab = tabs[0];
  var domain = kconnect.getDomainFromUrl(currentTab.url);
  $('h1').html(chrome.i18n.getMessage('appName'));
  $('#khresmoi').html(chrome.i18n.getMessage('khresmoiTitle'));
  $('#q').attr('placeholder',
    chrome.i18n.getMessage('khresmoiPlaceholder'));
  $('#searchSubmit').val(chrome.i18n.getMessage('khresmoiSearch'));
  $('#searchLanguage').val(kconnect.config.khresmoiLanguage);
  $('#host').html(domain);
  $('#readability').html(
    chrome.i18n.getMessage('readabilityTitle').toLowerCase()
  );

  $('#fundedBy').html(chrome.i18n.getMessage('fundedBy'));
  $('#trustability-content').html(chrome.i18n.getMessage('comingSoon'));
  $('#readability-content').html(chrome.i18n.getMessage('loading'));
  $('.readability-circle')
      .find('span')
      .html('<i class="fa fa-book" aria-hidden="true"></i>');

  $('.auto').html(
      '<i class="fa fa-warning" aria-hidden="true"></i> ' +
      chrome.i18n.getMessage('automatedResults')
  );
  $('#trustability').html(
    chrome.i18n.getMessage('trustabilityTitle').toLowerCase()
  );
  $('.trustability-circle')
    .find('span')
    .html('<i class="fa fa-stethoscope" aria-hidden="true"></i>');

  new ProgressBar.Circle('.trustability-circle', {
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

  $.when(readabilityRequest)
    .then(function(readabilityResponse) {
      var difficulty = readabilityResponse.readability.difficulty;
      var readabilityColor = 'red';
      var readabilityScore = 0.33;
      if (difficulty === 'average') {
        readabilityColor = '#ffdd00';
        readabilityScore = 0.66;
      } else if (difficulty === 'easy') {
        readabilityColor = 'lime';
        readabilityScore = 1;
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
        .html('<i class="fa fa-book" aria-hidden="true"></i>');
      rProgress.animate(readabilityScore);
      $('#readability-content').html(
        '<span>' + kconnect.config.difficultyKeyword[difficulty] + '</span>'
      );
    }, function() {
      $('#readability-content').html('<p>' +
        chrome.i18n.getMessage('popupReadabilityNoInformation') + '</p>');
      $('#readability-image').html(
        '<img src="images/unknown.png" />'
      );
      $('#users').hide();
    });
});
