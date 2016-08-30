var http = require('http'),
    mongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017'

mongoClient.connect(url, function(err, db){
    assert.equal(null, err);
    console.log('Connect to server');
    db.close();
});

module.exports = function(){
    http.createServer({});
}