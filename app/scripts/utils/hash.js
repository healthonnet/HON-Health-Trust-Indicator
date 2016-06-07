/*
 Hash.js
 Copyright © 2009-2011 Health On Net <honservices@healthonnet.org>

 This file is part of HON.

 The first version was HONcode Status; it was originally developed by Thierry
 Raguin 2003 NetUnion SARL within the European Project ActiveHealth .

 Developer:
 - Jeremy Blatter
 - William Belle
 */

/**
 * Representation de la honList sour la forme d'une HashMap
 * ["code_md5 du site", "n° certificat"]
 */
var hon_hash =
{
  // La HashMap
  items: null,

  /**
   * Initialisation de la HashMap
   */
  init: function() {
    this.items = new Array()
  },

  /**
   * Retourne la valeur selon la cle
   * @param {} inKey
   */
  getItem: function(inKey) {
    return this.items[inKey];
  },

  /**
   * Inscrit l'entree in_key in_value dans la Hash et
   * @param {} inKey
   * @param {} inValue
   * @return {} inValue
   */
  setItem: function(inKey, inValue) {
    if (typeof (inValue) != 'undefined') {
      this.items[inKey] = inValue;
    } else {
      dump('HON Error in Hash.setItem() : in_value is type \'undefined\'');
      Components.utils.reportError('HON Error in Hash.setItem() : ' +
        'in_value is type \'undefined\'');
    }
    return inValue;
  },
};