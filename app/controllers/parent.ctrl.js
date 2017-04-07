var path = require('path');

function Parent(name){
    this.name = name;
    console.log('in constructor');
    console.log(name);
};

Parent.prototype.showPath = function(){
    console.log( path.basename('./'));
};

Parent.prototype.foo = function(){
    console.log(foo);
};


module.exports = Parent;