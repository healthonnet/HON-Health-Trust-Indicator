var kconnect = {
    config: {
        difficultyIcons: {
            'easy': 'easy.png',
            'average': 'average.png',
            'difficult': 'difficult.png'
        },
        difficultyKeyword : {
            'easy': chrome.i18n.getMessage('tooltipReadabilityEasy'),
            'average': chrome.i18n.getMessage('tooltipReadabilityAverage'),
            'difficult': chrome.i18n.getMessage('tooltipReadabilityDifficult')
        },
        honCodeCompliance : [
            'Advertising policy',
            'Attribution',
            'Authoritative',
            'Complementarity',
            'Date',
            'Financial disclosure',
            'Justificability',
            'Privacy',
            'Transparency'
        ]
    },

    getDomainFromUrl : function(link){
        var url = document.createElement('a');
        url.href = link;
        var host = url.hostname;
        host = host.split('.');
        var domain = host.pop();
        return domain = host.pop() + '.' + domain;
    },

    getIsTrustable: function(domain){
        return $.get('http://apikconnect.honservices.org/~kconnect/cgi-bin/is-trustable.cgi?domain=' + domain);
    },

    getReadability: function(link){
        return $.get('http://apikconnect.honservices.org/~kconnect/cgi-bin/readability.cgi?data={"url":"' + link + '"}');
    },

    getMissingPrinciples: function(principles){
        var missingPrinciples = [];
        kconnect.config.honCodeCompliance.forEach(function (element) {
            if (principles.indexOf(element) < 0) {
                missingPrinciples.push(element);
            }
        });
        return missingPrinciples;
    }
};
