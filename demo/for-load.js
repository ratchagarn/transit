(function() {

'use strict';

console.log('Load file is working !');

var LoadFile = (function() {

  return {

    hello: function() {
      console.log('Hello world');
    }

  }

})();


exports('LoadFile', LoadFile);


}).call(this);