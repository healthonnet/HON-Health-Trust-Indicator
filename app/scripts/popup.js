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
  $('#readability').html(chrome.i18n.getMessage('readabilityTitle'));
  $('#trustability').html(chrome.i18n.getMessage('trustabilityTitle'));
  $('#readability-content').html(chrome.i18n.getMessage('loading'));
  $('#trustability-content').html(chrome.i18n.getMessage('loading'));
  var trustabilityRequest = kconnect.getIsTrustable(domain);
  var readabilityRequest = kconnect.getReadability(currentTab.url);
  kconnect.displayHONcodeStatus(currentTab.url);
  var siteJabberRequest = kconnect.getSiteJabber(domain);

  function siteJabberInformations(siteJabberResponse) {
    var jabberResult = JSON.parse(siteJabberResponse[0]);

    if (jabberResult.numReviews[0].rating === 0) {
      $('#users').hide();
      return;
    }
    $('#users').html(
      '<h3>' + chrome.i18n.getMessage('popupCommunityTitle') + '</h3>' +
      '<div class="community"><div id=\'stars\'></div>' +
      '<div><a href=\'' +
      jabberResult.urlProfilePage + '\' target=\'_blank\'>' +
      jabberResult.numReviews[0].rating + '</a> ' +
      chrome.i18n.getMessage('popupCommunityRatings') + '</div>' +
      '<a href="http://www.sitejabber.com/about-us" class="credit">' +
      '<img src="https://d1gzz21cah5pzn.cloudfront.net/' +
      'img/glb/sitejabber_logo_165x66.1465572590.png" ' +
      'alt="' + chrome.i18n.getMessage('popupCommunityPowered') + '" ' +
      'title="' + chrome.i18n.getMessage('popupCommunityPowered') +
      '"></a></div>'
    );

    var raterOptions = {
      max_value: 5,
      step_size: 0.1,
      initial_value: jabberResult.averageRating[0].rating,
      selected_symbol_type: 'utf8_star', // Must be a key from symbols
      readonly: true,
    };
    $('#stars').rate(raterOptions);

  }

  $.when(trustabilityRequest, readabilityRequest, siteJabberRequest)
    .then(function(trustabilityResponse, readabilityResponse,
      siteJabberResponse) {

      // SiteJabber informations
      siteJabberInformations(siteJabberResponse);

      // Trustability Informations
      if (trustabilityResponse[0].trustability === undefined) {
        $('#trustability-content').html('<p>' +
          chrome.i18n.getMessage('popupTrustabilityNoInformation') + '</p>');
        $('#readability-content').html('<p>' +
          chrome.i18n.getMessage('popupReadabilityNoInformation') + '</p>');
        $('#readability-image').html(
          '<img src="images/unknown.png" />'
        );
        return;
      }
      var principlesHtml = '';
      var score = trustabilityResponse[0].trustability.score;
      var difficulty = readabilityResponse[0].readability.difficulty;

      trustabilityResponse[0].trustability.principles.forEach(
        function(principle) {
        principlesHtml += '<li><span>✓</span> ' + principle + '</li>';
      });

      $('#trustability-content').html(
        '<ul>' + principlesHtml + '</ul>'
      );

      $('#readability-image').html(
        '<img src="images/' + difficulty + '.png" />'
      );

      $('#readability-content').html(
        '<span class="color-' + difficulty +
        '">' + kconnect.config.difficultyKeyword[difficulty] + '</span>'
      );

      var progress = new CircularProgress({
        radius: 40,
        strokeStyle: 'limegreen',
        lineCap: 'round',
        lineWidth: 5,
      });

      progress.update(score);
    }, function() {
      $('#trustability-content').html('<p>' +
        chrome.i18n.getMessage('popupTrustabilityNoInformation') + '</p>');
      $('#readability-content').html('<p>' +
        chrome.i18n.getMessage('popupReadabilityNoInformation') + '</p>');
      $('#readability-image').html(
        '<img src="images/unknown.png" />'
      );
      $('#users').hide();
    });
});
