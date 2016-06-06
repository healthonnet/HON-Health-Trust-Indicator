﻿/*
   listHON.js
   Copyright © 2009-2016 Health On Net <honservices@healthonnet.org>
   
   This file is part of HON. 
   
   The first version was HONcode Status; it was originally developed by Thierry 
   Raguin 2003 NetUnion SARL within the European Project ActiveHealth . 

   Developer: 
     - Jeremy Blatter 
     - William Belle
     - Cédric Frossard
*/

var hon_listHON = 
{  
    // Url de la liste des sites certifies
    url: "http://www.hon.ch/HONcode/Plugin/listeMD5.txt",
   
    // Initialisation de la HashMap
    initSiteList : false,
   
    init: function()
    {
        hon_listHON.load();
    },

    /**
     * Chargement de la honList avec une requete XMLHttpRequest
     */
    load: function()
    {
        // Creation de la requete XMLHttpRequest
        var honList = new XMLHttpRequest();

        // Requete de la liste
        honList.open("GET", this.url, true);
        //honList.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;  
        honList.onreadystatechange = function(){
         
            try {
 
                // La liste est prete ?
                if (honList.readyState === 4) {
                 
                    if (honList.status === 200) {  
                        hon_listHON.buildHash(honList);
                    } 
                }
            } catch (e) {
                dump(" hon_listHON.load: failed with " + e + "\n");
            }            
        }
       
        // Termine la requete XMLHttpRequest 
        honList.send(null);

        hon_listHON.watch();
   },
   
   /**
    * 
    */
   watch: function(){
     
     var timeout = (!this.initSiteList)? 5000 : 7200000;
     window.setTimeout(function() {hon_listHON.init();}, timeout);
   },
   
   /**
    * Construction de la Hashmap contenant la liste des sites certifies
    * @param {} honList
    */
   buildHash: function(honList)
   {
      // honList non vide et HashMap non initialisee
      if (honList != null && honList != ""){

        // Recupere dans un tableau la liste
         var tab = honList.responseText.split(new RegExp("[ \n\t]", "i"));
       
         // Initialise la HashMap
         hon_hash.init();
       
         // Affecte la liste dans la HashMap
         var len = tab.length-1;
         for(var i=1; i<len; i+=2){
            hon_hash.setItem( tab[i],    // cle
                              tab[i+1]); // valeur
         }
      }
      
      // La HashMap est initialisee
      this.initSiteList = true;
   },
   
   /**
    * Verifie l'URL dans la liste des sites certifies
    * @param {} myURL
    * @return {} result
    */
   checkURL: function(myURL)
   {
      var result = "";
      // Decoupe l'url sur "/"
      var myURLSplit = myURL.split('/');
      var count = myURLSplit.length;
      if(count > 1)
          count--;
      // Supprime la partie apres le dernier /
      while ( (result == "" || typeof(result) == 'undefined') &&
              (count > 0) ){

         var myURLTemp = ""; 
		      
         for (var j=0; j<count; j++){
            myURLTemp += myURLSplit[j] + "/";
         }

         result = hon_hash.getItem(hon_md5.hex_md5(myURLTemp));
         count--;
      }
     
      // Si le noeud n'a pas ete trouve, retourner ""
      if(typeof(result) == 'undefined'){
         result = "";
      }
     
      return result;
   },
   
   /**
    * Formate et retourne une URL (supprime nom de protocole au debut)
    * @param {} URL a formater
    * @return {} URL formatee 
    */
   formatHREF: function(href)
   {
      // Supprimer "http://" 
      if(href.indexOf("http://") == 0){
         href = href.substr(7);
      }
     
      // Supprimer "https://"
      else if(href.indexOf("https://") == 0){
         href = href.substr(8);
      }
      
      // Supprimer "www."
      if(href.indexOf("www.") == 0){
         href = href.substr(4);
      }
       
      return href;
   }
};

// Initialise la listHON
hon_listHON.init();