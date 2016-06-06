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

  $.when(trustabilityRequest, readabilityRequest)
    .then(function(trustabilityResponse, readabilityResponse) {

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
        principlesHtml += '<li>' + principle + '</li>';
      });

      $('#trustability').html(
        '<h3>Trustability : </h3>' +
        '<div id="circle"></div>' +
        '<p><a target="_blank" href="http://www.hon.ch/HONcode/' +
        'Patients/Conduct.html">HonCode :</a></p>' +
        '<ul>' + principlesHtml + '</ul>');

      $('#readability').html(
        ' <h3>Readability :</h3>' +
        '<div id="difficultyIcon" class="' + difficulty + '"></div>' +
        '<p class="' + difficulty + '">' +
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
    });
});

