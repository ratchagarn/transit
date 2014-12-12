/*!
 * Transit version 0.1.1
 * Copyright 2014-Preset
 * Author: Ratchagarn Naewbuntad
 * Licensed under MIT
 */
(function() {

'use strict';


/**
 * ------------------------------------------------------------
 * Transit core function
 * ------------------------------------------------------------
 */

var transit = (function() {

  var transit_storage = {};


  /**
   * ------------------------------------------------------------
   * Helper
   * ------------------------------------------------------------
   */
  

  /**
   * Empty function use as default callback
   * ------------------------------------------------------------
   * @name noop
   */
  
  function noop() {}
  

  /**
   * Clone object.
   * ------------------------------------------------------------
   * @name Random.clone
   * @param {Object} object is want to clone.
   * @return {Object} object it is not inherit of another.
   */

  function clone(from) {
    var name, to;
    to = {};
    for (name in from) {
      if (from.hasOwnProperty(name)) {
        to[name] = from[name];
      }
    }
    return to;
  }


  /**
   * Clone function
   * ------------------------------------------------------------
   * @name cloneFunction
   * @param {Function} function for clone
   * @return {Function} function for clone
   */

  function cloneFunction(func) {
    function F() {}
    F.apply(func);
    return F;
  }


  return {

    /**
     * View exports name is avaliable right now
     * ------------------------------------------------------------
     * @name list
     * @return {Array} exports name is avaliable list
     */

    list: function() {
      var exports_avaliable = [];
      for (var _name in transit_storage) {
        exports_avaliable.push(_name);
      }
      return exports_avaliable;
    },


    /**
     * Exports function
     * ------------------------------------------------------------
     * @name transit.exports
     * @param {String} context name
     * @param {Function} export function
     */

    exports: function(name, func) {
      // check exports function exist or not
      if (transit_storage[name]) {
        throw new Error('Exports name `' + name + '` is already exist.');
      }

      transit_storage[name] = func;
    },


    /**
     * Require function/object
     * ------------------------------------------------------------
     * @name transit.require
     * @param {String} context name
     * @return {Object} export function/object
     */

    require: function(name) {
      return transit_storage[name];
    },


    /**
     * Require function/object with clone function/object
     * ------------------------------------------------------------
     * @name transit.requireClone
     * @param {String} context name
     * @return {Object} export function/object
     */
    
    requireClone: function(name) {

      var resource = require(name);

      if (resource) {

        // clone function
        if (typeof resource === 'function') {
          resource = cloneFunction(resource);
        }
        // clone array
        else if (resource instanceof Array) {
          resource = resource.slice(0);
        }
        // clone object
        else if (typeof resource === 'object') {
          resource = clone(resource);
        }

        return resource;
      }

    },


    /**
     * Load another script to execute in current file
     * See: http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file
     * ------------------------------------------------------------
     * @name transit.load
     * @param {String} url script for load
     * @param {Function} callback function fire after script load finish
     * @param {String} context for append script [head|current|bottom] (default is current script file)
     */
    
    load: function(url, callback, append_to) {
      if (append_to == null) { append_to = 'current'; }

      var script = document.createElement('script');
      script.src = url;

      // Then bind the event to the callback function.
      // There are several events for cross browser compatibility.
      script.onreadystatechange = (callback || noop);
      script.onload = (callback || noop);

      if (append_to === 'head') {
        document.getElementsByTagName('head')[0].appendChild(script);
      }
      else if (append_to === 'current') {
        var currentScript = document.getElementsByTagName('script');
        currentScript = currentScript[currentScript.length - 1];
        currentScript.parentNode.insertBefore(script, currentScript);
      }
      else if (append_to === 'bottom') {
        document.getElementsByTagName('body')[0].appendChild(script);
      }

    }


  };

})();


/**
 * ------------------------------------------------------------
 * Make alias
 * ------------------------------------------------------------
 */

if (!window.exports && !window.require && !window.requireClone) {
  window.exports = transit.exports;
  window.require = transit.require;
  window.requireClone = transit.requireClone;
}

window.transit = transit;


}).call(this);