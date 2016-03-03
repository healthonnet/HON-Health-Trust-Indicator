'use strict';

var currentTab;
var query = { active: true, currentWindow: true };

chrome.tabs.query(query, function(tabs) {
    currentTab = tabs[0];
    var domain = kconnect.getDomainFromUrl(currentTab.url);
    $('#host').html(domain);
    var trustabilityRequest = kconnect.getIsTrustable(domain),
        readabilityRequest = kconnect.getReadability(currentTab.url);

    $.when(trustabilityRequest, readabilityRequest)
        .then(function (trustabilityResponse, readabilityResponse) {
            console.log(readabilityResponse);
            //Trustability Informations
            if (trustabilityResponse[0].trustability === undefined) {
                return;
            }
            var principlesHtml = '',
                score = trustabilityResponse[0].trustability.score;

            trustabilityResponse[0].trustability.principles.forEach(function(principle){
                principlesHtml += '<li>' + principle + '</li>';
            });

            $('#trustability').html(
                '<h3>Trustability : </h3>' +
                '<div id="circle"></div>' +
                '<ul>' + principlesHtml + '</ul>');

            $('#readability').html(
                ' <h3>Readability :</h3>' +
                '<div id="difficultyIcon" class="' + readabilityResponse[0].readability.difficulty  + '"></div>' +
                '<p class="' + readabilityResponse[0].readability.difficulty + '">' +
                kconnect.config.difficultyKeyword[readabilityResponse[0].readability.difficulty] +
                '</p>');

            var progress = new CircularProgress({
                radius: 40,
                strokeStyle: 'limegreen',
                lineCap: 'round',
                lineWidth: 5
            });

            $('#circle').html(progress.el);

            progress.update(score);
        });
});

