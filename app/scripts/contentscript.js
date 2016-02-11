'use strict';

//Config
var difficultyColors = {
  'easy': 'limegreen',
  'average': '#ffc520',
  'difficult': 'crimson'
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
  //clean DOM
  $('div.rc .s .hon.rdb').remove();

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
    //TODO make it clearer
    var url = document.createElement('a');
    url.href = link;
    var host = url.hostname;
    host = host.split('.');
    var domain = host.pop();
    domain = host.pop() + '.' + domain;

  //Trustability
    $.get( 'http://api.kconnect.honservices.org/~kconnect/cgi-bin/is-trustable.cgi?domain=' + domain, function( data ) {
      if(data.info === undefined) {
        var tooltip = chrome.i18n.getMessage('tooltipTrustabilityLevel'),
          trustabilityLevel = Math.round((data.trustability.principles.length / 9) * 100);

        tooltip = tooltip.replace(/%VALUE%/g, trustabilityLevel);

        if(trustabilityLevel !== 100){
          var missingPrinciples = '';
          tooltip += '</br>' + chrome.i18n.getMessage('tooltipTrustabilityMissingPrinciples');

          honCodeCompliance.forEach(function(element){
            if(data.trustability.principles.indexOf(element) < 0){
              missingPrinciples += ', ' + element;
            }
          });
          missingPrinciples = missingPrinciples.substr(1);

          tooltip = tooltip.replace(/%PRINCIPLES%/g, missingPrinciples);
        }

        var html =
          '<div class="hon trb" style="display: none;">' +
            '<span class="tooltip">' +
            tooltip +
            '</span>' +
            '<span class="meter" style=" width: ' + trustabilityLevel + '%"> </span>' +
          '</div>';
        $(nodeList.item(index)).parent().parent().children('.s').prepend(html);

        //Readability
        $.get('http://api.kconnect.honservices.org/~kconnect/cgi-bin/readability.cgi?data={"url":"' + link + '"}', function (dataRdb) {
          var htmlRdb =
            '<a class="hon rdb" href="' + link + '" style="background-color: ' + difficultyColors[dataRdb.readability.difficulty] + ';">' +
              '' +
              '<span class="tooltip">' +
                difficultyKeyword[dataRdb.readability.difficulty] +
              '</span>' +
            '</a>';
          $(nodeList.item(index)).parent().parent().children('.s').prepend(htmlRdb);
        }).done(function() {
          $('.hon').show();
        });
      }
    });
  });
};

updateLinks();