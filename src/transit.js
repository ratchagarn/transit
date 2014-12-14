(function(W) {

'use strict';


/**
 * ------------------------------------------------------------
 * Transit core function
 * ------------------------------------------------------------
 */

var transit = (function(W) {

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


  /**
   * Encode string to base64
   * see: http://phpjs.org/functions/base64_encode/
   * ------------------------------------------------------------
   * @name base64Encode
   * @param {String} string for encode
   * @return {String} string encode with base64
   */
  
  function base64Encode(data) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
      ac = 0,
      enc = '',
      tmp_arr = [];

    if (!data) {
      return data;
    }

    do { // pack three octets into four hexets
      o1 = data.charCodeAt(i++);
      o2 = data.charCodeAt(i++);
      o3 = data.charCodeAt(i++);

      bits = o1 << 16 | o2 << 8 | o3;

      h1 = bits >> 18 & 0x3f;
      h2 = bits >> 12 & 0x3f;
      h3 = bits >> 6 & 0x3f;
      h4 = bits & 0x3f;

      // use hexets to index into b64, and append result to encoded string
      tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    var r = data.length % 3;

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
  }


  /**
   * Generate ID from url for track load script
   * ------------------------------------------------------------
   * @name generateLoadID
   * @return {String} load ID
   */
  
  function generateLoadID(url) {
    return 'transit-load-' + base64Encode(url);
  }


  /**
   * Clean up duplication script tag before load
   * ------------------------------------------------------------
   * @name cleanUpScript
   * @param {String} script id for remove
   */
  
  function cleanUpScript(id) {
    var target = document.getElementById(id);
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
        throw new Error('Export name `' + name + '  doesn\'t exist.');
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
    
    load: function(url, callback, context) {
      if (context == null) { context = 'current'; }

      var script = document.createElement('script'),
          id = generateLoadID(url);

      // remove duplicate script
      cleanUpScript(id);

      script.id = id;
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

})(window);


/**
 * ------------------------------------------------------------
 * Make alias
 * ------------------------------------------------------------
 */

if (!W.exports && !W.require && !W.requireClone) {
  W.exports = transit.exports;
  W.require = transit.require;
  W.requireClone = transit.requireClone;
}

W.transit = transit;

})(window);