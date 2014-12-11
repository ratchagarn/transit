(function() {

'use strict';


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


function cloneFunction(func) {
  function F() {}
  F.apply(func);
  return F;
}


var transit = (function() {

  var transit_storage = {};

  return {

    /**
     * Exports function
     * ------------------------------------------------------------
     * @name exports
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
     * Require function
     * ------------------------------------------------------------
     * @name require
     * @param {String} context name (set to `__list` for view exports avaliable right now)
     * @param {Boolean} clone object/function or not
     * @return {Object} export function
     */

    require: function(name, clone_this) {

      if (name === '__list') {
        var exports_avaliable = [];
        for (var _name in transit_storage) {
          exports_avaliable.push(_name);
        }
        return exports_avaliable;
      }
      else {

        var resource = transit_storage[name];

        if (resource) {

          // set default clone argument
          if (clone_this == null) { clone_this = false; }

          // if clone avaliable then clone by type
          if (clone_this) {

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

          }

          return resource;
        }

      }
    }

  };

})();


/**
 * ------------------------------------------------------------
 * Make alias
 * ------------------------------------------------------------
 */

if (!window.exports && !window.require) {
  window.exports = transit.exports;
  window.require = transit.require;
}

window.transit = transit;


}).call(this);