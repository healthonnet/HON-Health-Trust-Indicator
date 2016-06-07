'use strict';

var currentTab;
var query = {active: true, currentWindow: true};

chrome.tabs.query(query, function(tabs) {
  currentTab = tabs[0];
  var domain = kconnect.getDomainFromUrl(currentTab.url);
  $('#host').html(domain);
  var trustabilityRequest = kconnect.getIsTrustable(domain);
  var readabilityRequest = kconnect.getReadability(currentTab.url);
  kconnect.displayHONcodeStatus(domain);
  var siteJabberRequest = kconnect.getSiteJabber(domain);

  function siteJabberInformations(siteJabberResponse) {
    var jabberResult = JSON.parse(siteJabberResponse[0]);

    if (jabberResult.numReviews[0].rating === 0) {
      $('#users').hide();
      return
    }
    $('#users').html(
      '<h3>Community ratings ( ' +
      '<a href=\'' + jabberResult.urlProfilePage + '\' target=\'_blank\'>' +
      jabberResult.numReviews[0].rating + '</a> ) : </h3>' +
      '<div id=\'stars\'></div>' +
      '<span class=\'credit\'><a href=\'http://www.sitejabber.com/about-us\'>' +
      'Powered by SiteJabber</a></span>'

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
    .then(function(trustabilityResponse, readabilityResponse
      , siteJabberResponse) {

      // SiteJabber informations
      siteJabberInformations(siteJabberResponse);

      // Trustability Informations
      if (trustabilityResponse[0].trustability === undefined) {
        $('#trustability').html('<p>No Trustability informations ' +
          'for this domain</p>');
        $('#readability').html('<p>No Readability  informations</p>');
        return;
      }
      var principlesHtml = '';
      var score = trustabilityResponse[0].trustability.score;
      var difficulty = readabilityResponse[0].readability.difficulty;

      trustabilityResponse[0].trustability.principles.forEach(
        function(principle) {
        principlesHtml += '<li>- ' + principle + '</li>';
      });

      $('#trustability').html(
        '<h3>Trustability : </h3>' +
        '<div id=\'circle\'></div>' +
        '<div><p><a target=\'_blank\' href=\'http://www.hon.ch/HONcode/' +
        'Patients/Conduct.html\'>HonCode :</a></p>' +
        '<ul>' + principlesHtml + '</ul></div>');

      $('#readability').html(
        ' <h3>Readability :</h3>' +
        '<div id=\'difficultyIcon\' class=\'' + difficulty + '\'></div>' +
        '<p class=\'difficulty ' + difficulty + '\'>' +
        kconnect.config.difficultyKeyword[difficulty] +
        '</p>');

      var progress = new CircularProgress({
        radius: 40,
        strokeStyle: 'limegreen',
        lineCap: 'round',
        lineWidth: 5,
      });

      $('#circle').html(progress.el);

      progress.update(score);
    }, function() {
      $('#trustability').html('<p>No Trustability informations for' +
        ' this domain</p>');
      $('#readability').html('<p>No Readability  informations</p>');
      $('#users').hide();
    });
});

