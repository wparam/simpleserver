var http = require('http'),
    mongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/test'

mongoClient.connect(url, function(err, db){
    assert.equal(null, err);
    console.log('Connect to server');
    console.log(db.getCollection('user').find());
    db.close();
});

module.exports = function(){
    http.createServer({});
}