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


transit.exports('LoadFile', LoadFile, 'load');


}).call(this);