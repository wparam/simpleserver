var path = require('path');

function Parent(name){
    this.name = name;
}

Parent.prototype.showPath = function(){
    console.log('show parent"s path: '+ this.name);
};

Parent.prototype.foo = function(){
    console.log('foo');
};


module.exports = Parent;