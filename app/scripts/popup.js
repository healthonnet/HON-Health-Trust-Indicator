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
  $('.readability-circle').circleProgress({
    value: 0,
    animation: false,
  });
  $('.readability-circle')
    .find('span')
    .html('<i class="fa fa-book" aria-hidden="true"></i>');
  $('.trustability-circle').circleProgress({
    value: 0,
    animation: false,
  });
  $('.trustability-circle')
    .find('span')
    .html('<i class="fa fa-stethoscope" aria-hidden="true"></i>');
  var trustabilityRequest = kconnect.getIsTrustable(domain);
  var readabilityRequest = kconnect.getReadability(currentTab.url);
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
        return;
      }
      var principlesHtml = '';
      var score = trustabilityResponse[0].trustability.score;
      var difficulty = readabilityResponse[0].readability.difficulty;

      trustabilityResponse[0].trustability.principles.forEach(
        function(principle) {
        principlesHtml += '<li><i class="fa fa-cog" aria-hidden="true"></i> ' +
        principle + '</li>';
      });

      var readabilityColor = 'red';
      var readabilityScore = 0.33;
      if (difficulty === 'average') {
        readabilityColor = 'orange';
        readabilityScore = 0.66;
      } else if (difficulty === 'easy') {
        readabilityColor = 'lime';
        readabilityScore = 1;
      }
      $('.readability-circle').circleProgress({
        value: readabilityScore,
        animation: true,
        fill: {
          color: readabilityColor,
        },
      });
      $('.readability-circle')
        .find('span')
        .html('<i class="fa fa-book" aria-hidden="true"></i>');
      $('#readability-content').html(
        '<span>' + kconnect.config.difficultyKeyword[difficulty] + '</span>'
      );

      var trustabilityColor = 'red';
      if (score > 33 && score <= 66) {
        trustabilityColor = 'orange';
      } else if (score > 66) {
        trustabilityColor = 'lime';
      }
      $('.trustability-circle').circleProgress({
        value: (score / 100),
        animation: true,
        fill: {
          color: trustabilityColor,
        },
      });
      $('.trustability-circle').find('span').html(score);
      $('#trustability-content').html(
        '<ul>' + principlesHtml + '</ul>'
      );
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
