/*!
 * Transit version 0.1.5
 * Copyright 2014-Preset
 * Author: Ratchagarn Naewbuntad
 * Licensed under MIT
 */
(function() {

'use strict';

var global = this;


/**
 * ------------------------------------------------------------
 * Transit core function
 * ------------------------------------------------------------
 */

var transit = (function() {

  var transit_storage = {},
      export_action_name = ['normal', 'update', 'load'];


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
   * Check object is Array or not
   * ------------------------------------------------------------
   * @name isArray
   * @param {Object} object for check
   * @return {Boolean} result Array or not
   */
  
  function isArray(obj) {
    if (obj instanceof Array) {
      return true;
    }
    else {
      return false;
    }
  }
  

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
    F.call(func);
    return F;
  }


  /**
   * Clean up duplication script tag before load
   * ------------------------------------------------------------
   * @name cleanUpScript
   * @param {String} script url for remove
   */
  
  function cleanUpScript(url) {
    var target = document.querySelector('script[src="' + url + '"]');
    if (target) {
      target.parentNode.removeChild(target);
    }
  }


  /**
   * ------------------------------------------------------------
   * Avaliable method
   * ------------------------------------------------------------
   */
  
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
     * @param {String} action string for test export what to do
     */

    exports: function(name, func, action) {
      if (action == null) { action = 'normal'; }
      if (export_action_name.indexOf(action) === -1) {
        throw new Error('Export action name `' + action + '` doesn\'t exist. (' + export_action_name + ')'); 
      }

      // check exports function exist or not
      if (transit_storage[name]) {
        if (action !== 'update' && action !== 'load') {
          throw new Error('Export name `' + name + '` is already exist.'); 
        }

        // update export source
        if (action === 'update') {
          transit_storage[name] = func;
        }

      }
      else {
        transit_storage[name] = func;
      }

    },


    /**
     * Require function/object
     * ------------------------------------------------------------
     * @name transit.require
     * @param {String} context name
     * @return {Object} export function/object
     */

    require: function(name) {
      if (!transit_storage[name]) {
        console.warn('Exports name `' + name + '` doesn\'t exist.');
      }
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
        else if (isArray(resource)) {
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
    
    load: function(url, callback, context) {
      if (context == null) { context = 'current'; }

      // remove duplicate script
      cleanUpScript(url);

      var script = document.createElement('script');
      script.src = url;

      // Then bind the event to the callback function.
      // There are several events for cross browser compatibility.
      script.onreadystatechange = (callback || noop);
      script.onload = (callback || noop);


      if (context === 'head') {
        document.getElementsByTagName('head')[0].appendChild(script);
      }
      else if (context === 'current') {
        var currentScript = document.getElementsByTagName('script');
        currentScript = currentScript[currentScript.length - 1];
        currentScript.parentNode.insertBefore(script, currentScript);
      }
      else if (context === 'bottom') {
        document.getElementsByTagName('body')[0].appendChild(script);
      }

      // clean up load script
      // script.parentNode.removeChild(script);
    }


  };

})();


global.transit = transit;

}).call(this);