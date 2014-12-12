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


transit.load('for-load.js', function() {
  var LoadFile = require('LoadFile');
  D.getElementById('greeting').appendChild(
    D.createTextNode( LoadFile.greeting() )
  );
});


exports('A', A);


}).call(this, document);