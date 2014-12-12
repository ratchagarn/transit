(function() {

'use strict';


var A = (function() {

  var name = 'Function A';

  return {

    getName: function() {
      return name;
    }

  }

})();


transit.load('for-load.js', function() {
  var LoadFile = require('LoadFile');
  console.log(LoadFile);
});


exports('A', A);


}).call(this);