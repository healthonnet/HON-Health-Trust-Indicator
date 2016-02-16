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


var updateLinks = function(){

  //Get links
  var links = [];
  var nodeList = document.querySelectorAll('div.rc h3.r a');

  for (var i = 0; i < nodeList.length; ++i) {
    links[i] = nodeList[i].href;
  }

  links.forEach(function(link, index){
    //TODO Must be HTTPS (otherwise: rejected by chrome)
    //TODO Test results pertinence

    //Get root domain name.
    var url = document.createElement('a');
    url.href = link;
    var host = url.hostname;
    host = host.split('.');
    var domain = host.pop();
    domain = host.pop() + '.' + domain;

    //Trustability
    $.get( 'http://api.kconnect.honservices.org/~kconnect/cgi-bin/is-trustable.cgi?domain=' + domain, function( data ) {
      //No warning or error from the API.
      if(data.info === undefined) {
        var tooltip = chrome.i18n.getMessage('tooltipTrustabilityLevel'),
          trustabilityLevel = Math.round((data.trustability.principles.length / 9) * 100);

        tooltip = tooltip.replace(/%VALUE%/g, trustabilityLevel);

        //If some HONCode are missing we found them.
        if(trustabilityLevel !== 100){
          tooltip += '</br>' + chrome.i18n.getMessage('tooltipTrustabilityMissingPrinciples');

          var missingPrinciples = '';
          honCodeCompliance.forEach(function(element){
            if(data.trustability.principles.indexOf(element) < 0){
              missingPrinciples += ', ' + element;
            }
          });

          tooltip = tooltip.replace(/%PRINCIPLES%/g, missingPrinciples.substr(1));
        }

        var html =
          '<div class="hon trb" style="display: none;">' +
            '<span class="tooltip">' +
            tooltip +
            '</span>' +
            '<span class="meter" style=" width: ' + trustabilityLevel + '%"> </span>' +
          '</div>';
        if($(nodeList.item(index)).parent().siblings('.s').children('.trb').length < 1){
            $(nodeList.item(index)).parent().siblings('.s').prepend(html);
        }

    //Readability
        $.get('http://api.kconnect.honservices.org/~kconnect/cgi-bin/readability.cgi?data={"url":"' + link + '"}', function (dataRdb) {
          var htmlRdb =
            '<a class="hon rdb" href="' + link + '" style=\'background-image: url("chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/images/' + difficultyIcons[dataRdb.readability.difficulty] + '");\'>' +
              '' +
              '<span class="tooltip">' +
                difficultyKeyword[dataRdb.readability.difficulty] +
              '</span>' +
            '</a>';
            if($(nodeList.item(index)).parent().siblings('.s').children('.rdb').length < 1){
                $(nodeList.item(index)).parent().siblings('.s').prepend(htmlRdb);
            }

        }).done(function() {
            $(nodeList.item(index)).parent().siblings('.s').children('.hon').show();
        });
      }
    });
  });
};

updateLinks();