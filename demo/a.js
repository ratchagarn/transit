(function() {

'use strict';

function a() {
  this.name = 'Function A';
}

a.prototype = {

  getName: function() {
    return this.name;
  }

};


exports('a', a);


}).call(this);