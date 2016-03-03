var currentTab;
var query = { active: true, currentWindow: true };

chrome.tabs.query(query, function(tabs) {
    currentTab = tabs[0];
    var domain = kconnect.getDomainFromUrl(currentTab.url);
    $('#host').html(domain);
    var trustabilityRequest = kconnect.getIsTrustable(domain),
        readabilityRequest  = kconnect.getReadability(currentTab.url);

    $.when(trustabilityRequest, readabilityRequest)
        .then(function (trustabilityResponse, readabilityResponse) {
            console.log(readabilityResponse);
            //Trustability Informations
            if (trustabilityResponse[0].trustability === undefined) {
                return;
            }
            var principlesHtml ="",
                score = trustabilityResponse[0].trustability.score;

            trustabilityResponse[0].trustability.principles.forEach(function(principle){
                principlesHtml += "<li>" + principle + "</li>";
            });

            $('#trustability').html("<ul>" + principlesHtml + "</ul>");

            $('#readability').html(
                "<span class='" + readabilityResponse[0].readability.difficulty + "'>" +
                kconnect.config.difficultyKeyword[readabilityResponse[0].readability.difficulty]) +
                "</span>"
            ;
        });
});