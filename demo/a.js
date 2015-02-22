(function(D) {

'use strict';


var A = (function() {

  var name = 'Function A';

  return {

    getName: function() {
      return name;
    }

  }

})();



transit.exports('A', A);


}).call(this, document);