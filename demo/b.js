(function() {

'use strict';

var A = transit.require('A');


var B = (function() {

  var name = 'Function B';

  return {

    getName: function() {
      return name;
    }

  }

})();


console.log( A.getName() );


A.add = function(a, b) {
  return a + b;
}


transit.exports('B', B);

}).call(this);