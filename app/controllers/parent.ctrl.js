var path = require('path');

function Parent(name){
    this.name = name;
};

Parent.prototype.showPath = function(){
    console.log('%s path is: %s', this.name, path.basename('./'));
};

module.exports = Parent;