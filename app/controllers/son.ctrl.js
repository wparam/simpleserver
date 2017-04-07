var Parent = require('./parent.ctrl'),
    util = require('util');

function Son(){
    Parent.apply(this, arguments);
    this.age = 20;
    // Parent.super_.call(this, arguments);
}

util.inherits(Son, Parent);

// Son.prototype.showPath=function(){
//     console.log('show son"s path');
// }

Son.prototype.handle = function(req, res){
    console.log(this.name);
    console.log(this.age);
    res.status(200).send('success');
};

var son =new Son('FatherName');

module.exports = new Son();