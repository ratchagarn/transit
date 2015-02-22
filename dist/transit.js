/*!
 * Transit version 0.3.0
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
      transit_storage_name = [];


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
   * Deep extend object.
   * http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
   * ------------------------------------------------------------
   * @name extend
   * @param {Object} destination object.
   * @param {Object} object for extend to destination.
   * @return {Object} reference to destination.
   */

  function extend(dst, source) {
    for (var prop in source) {
      if (source[prop] &&
          source[prop].constructor &&
          source[prop].constructor === Object) {
        dst[prop] = dst[prop] || {};
        extend(dst[prop], source[prop]);
      } else {
        dst[prop] = source[prop];
      }
    }
    return dst;
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
   * Get deep object from array keys
   * http://stackoverflow.com/questions/2631001/javascript-test-for-existence-of-nested-object-key
   * ------------------------------------------------------------
   * @name getDeepObject
   * @param {Object} object for get data
   * @param {Array} object level for get data
   *                example: ['lib', 'util'] = obj.lib.util
   * @return {Boolean} object key is exist or not
   */

  function getDeepObject(obj, keys) {
    for (var i = 0, len = keys.length; i < len; i++) {
      if ( typeof obj[keys[i] ] === 'undefined' ) {
        return null;
      }
      obj = obj[keys[i]];
    }
    return obj;
  }


  /**
   * Name format for exports or require
   * ------------------------------------------------------------
   * @name nameFormat
   * @param {String} name for exports or require
   * @return {Array} name array for create deep object or get deep object value
   */

  function nameFormat(name) {
    return name.replace(/^\//, '').split('/');
  }


  /**
   * ------------------------------------------------------------
   * available method
   * ------------------------------------------------------------
   */
  
  return {

    /**
     * View exports name is available right now
     * ------------------------------------------------------------
     * @name transit.list
     * @return {Array} exports name is available list
     */

    list: function() {
      var exports_available = [];
      for (var i = 0, len = transit_storage_name.length; i < len; i++) {
        exports_available.push(transit_storage_name[i]);
      }
      return exports_available;
    },


    /**
     * Exports function
     * ------------------------------------------------------------
     * @name transit.exports
     * @param {String} context name
     * @param {Any} export source
     */

    exports: function(name, source) {
      if (transit_storage_name.indexOf(name) !== -1) {
        throw new Error('Export name `' + name + '` is already exist.');
      }

      // add name reference for check duplicate later
      transit_storage_name.push(name);


      var temp = {},
          obj = temp,
          value = {};

      // split name with `/` for create deep object
      name = nameFormat(name);

      for (var i = 0, len = name.length; i < len; i++) {
        if (i < len - 1) {
          value = {};
        }
        else {
          value = source;
        }
        temp = temp[ name[i] ] = value;
      }

      extend(transit_storage, obj);
    },


    /**
     * Require function/object
     * ------------------------------------------------------------
     * @name transit.require
     * @param {String} context name
     * @return {Object} export function/object
     */

    require: function(name) {
      if ( transit_storage_name.indexOf(name) === -1 ) {
        console.warn('Exports name `' + name + '` doesn\'t exist.');
      }
      return getDeepObject( transit_storage, nameFormat(name) );
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
     * http://stackoverflow.com/questions/950087/include-a-javascript-file-in-another-javascript-file
     * ------------------------------------------------------------
     * @name transit.load
     * @param {String} url script for load
     * @param {Function} callback function fire after script load finish
     * @param {String} context for append script
     *                 [head|current|bottom] (default is current script file)
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
    },


    /**
     * Destroy transit storage
     * ------------------------------------------------------------
     * @name transit.destroy
     */

    destroy: function() {
      // reset all storage and name
      transit_storage = {};
      transit_storage_name = [];
    }

  };

})();


global.transit = transit;

}).call(this);