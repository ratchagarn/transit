(function() {

'use strict';

console.log('Load file is working !');

var LoadFile = (function() {

  return {

    greeting: function() {
      return 'Hello world';
    }

  }

})();


exports('LoadFile', LoadFile);


}).call(this);