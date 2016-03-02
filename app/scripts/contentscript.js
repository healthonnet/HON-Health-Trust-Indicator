'use strict';

//Config
var difficultyIcons = {
        'easy': 'easy.png',
        'average': 'average.png',
        'difficult': 'difficult.png'
    },
    difficultyKeyword = {
        'easy': chrome.i18n.getMessage('tooltipReadabilityEasy'),
        'average': chrome.i18n.getMessage('tooltipReadabilityAverage'),
        'difficult': chrome.i18n.getMessage('tooltipReadabilityDifficult')
    },
    honCodeCompliance = [
        'Advertising policy',
        'Attribution',
        'Authoritative',
        'Complementarity',
        'Date',
        'Financial disclosure',
        'Justificability',
        'Privacy',
        'Transparency'
    ];

var readabilityCallback = function (dataRdb, target, link) {
    if (dataRdb.readability === undefined) {
        return;
    }

    var htmlRdb =
        '<a class="hon rdb" href="' + link + '" style=\'background-image: url("' + chrome.extension.getURL( 'images/' + difficultyIcons[dataRdb.readability.difficulty] ) + '");\'">' +
        '<span class="tooltip">' +
        difficultyKeyword[dataRdb.readability.difficulty] +
        '</span>' +
        '</a>';
    if (target.children('.rdb').length === 0) {
        target.prepend(htmlRdb);
    }
};
var trustabilityCallback = function (data, target) {
    if (data.trustability === undefined) {
        return;
    }

    var tooltip = chrome.i18n.getMessage('tooltipTrustabilityLevel'),
        trustabilityLevel = Math.round((data.trustability.principles.length / 9) * 100);

    tooltip = tooltip.replace(/%VALUE%/g, trustabilityLevel);

//If some HONCode are missing we found them.
    if (trustabilityLevel !== 100) {
        tooltip += '</br>' + chrome.i18n.getMessage('tooltipTrustabilityMissingPrinciples');

        var missingPrinciples = '';
        honCodeCompliance.forEach(function (element) {
            if (data.trustability.principles.indexOf(element) < 0) {
                missingPrinciples += ', ' + element;
            }
        });

        tooltip = tooltip.replace(/%PRINCIPLES%/g, missingPrinciples.substr(1));
    }

    var html =
        '<div class="hon trb">' +
        '<span class="tooltip">' +
        tooltip +
        '</span>' +
        '<span class="meter" style=" width: ' + trustabilityLevel + '%"> </span>' +
        '</div>';
    if (target.children('.trb').length === 0) {
        target.prepend(html);
    }
};


var updateLinks = function () {
    var deferred = new $.Deferred();

    //Get links
    var links = [],
        hrefSelector = '',
        targetSelector = '',
        trustabilityRequested = 0;

    //Match Google
    if (window.location.host.indexOf('google') > -1) {
        hrefSelector = 'h3.r a';
        targetSelector = '.s';
    }
    //Match Yahoo
    else if (window.location.host.indexOf('yahoo') > -1) {
        hrefSelector = 'div.compTitle h3.title a';
        targetSelector = 'div:first';
    }
    //Match Bing
    else if (window.location.host.indexOf('bing') > -1) {
        hrefSelector = 'li.b_algo h2 a';
        targetSelector = 'div.b_caption';
    }
    var nodeList = document.querySelectorAll(hrefSelector);
    for (var i = 0; i < nodeList.length; ++i) {
        links[i] = nodeList[i].href;
    }
    links.forEach(function (link, index) {
        var target = $(nodeList.item(index)).parent().siblings(targetSelector),
        //Get root domain name.
            url = document.createElement('a');
        url.href = link;
        var host = url.hostname;
        host = host.split('.');

        var domain = host.pop();
        domain = host.pop() + '.' + domain;

        var trustabilityRequest = $.get('http://apikconnect.honservices.org/~kconnect/cgi-bin/is-trustable.cgi?domain=' + domain),
            readabilityRequest = $.get('http://apikconnect.honservices.org/~kconnect/cgi-bin/readability.cgi?data={"url":"' + link + '"}');

        $.when(trustabilityRequest, readabilityRequest)
            .then(function (trustabilityResponse, readabilityResponse) {
                trustabilityCallback(trustabilityResponse[0], target);
                readabilityCallback(readabilityResponse[0], target, link);
            })
            .always(function () {
                if(target.children('.hon').length !== 2){
                    target.children('.hon').hide();
                }

                trustabilityRequested++;
                if (trustabilityRequested === links.length) {
                    deferred.resolve();
                }
            });
    });
    return deferred.promise();
};

updateLinks().done(function () {
    console.log('hon-kconnect-chrome-extension');
});
