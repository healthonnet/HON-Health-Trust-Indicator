'use strict';

console.log('\'Allo \'Allo! Content script');

//Config
var colors = {
  'easy': 'limegreen',
  'average': '#ffc520',
  'difficult': 'crimson'
};


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

    //Readability
    $.get( 'http://api.kconnect.honservices.org/~kconnect/cgi-bin/readability.cgi?data={"url":"' + link + '"}', function( data ) {
      //TODO tester la pertinence du résultat avant affichage
      var html =
        '<span class="hon rdb" style="color: ' + colors[data.readability.difficulty] + '; display: none;">' +
        'Rdb : ' + data.readability.score + '(' + data.readability.difficulty + ')' +
        '</span>';
      $(nodeList.item(index)).parent().parent().children('.s').prepend(html);
    });

    //Trustability
    /*$.get( 'http://api.kconnect.honservices.org/~kconnect/cgi-bin/trustability.cgi?data={"url":"'+link+'"}', function( data ) {
     //On test la pertinence du résultat avant affichage
     console.log(data);
     });*/

  });
};

updateLinks();