var Parent = require('./parent.ctrl'),
    util = require('util');

function Son(){
    Parent.call(this, arguments);
}

util.inherits(Son, Parent);

var son =new Parent();
son.showPath();