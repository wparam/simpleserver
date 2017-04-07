var Parent = require('./parent.ctrl'),
    util = require('util');

function Son(){
    Parent.call(this, arguments);
}

util.inherits(Son, Parent);

var son = new Son('it is son');
son.showPath();