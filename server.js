var http = require('http'),
    mongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/test'

mongoClient.connect(url, function(err, db){
    assert.equal(null, err);
    console.log('Connect to server');

    insertFun(db, function(){
        db.close();
    });
    
});

module.exports = function(){
    http.createServer({});
}


function insertFun(db, callback){
    var col = db.collection('user');
    col.insertMany([
        {a: 1}, {b:2}
    ], function(err, result){
        assert.equal(null, err);
        assert.equal(2, result.result.n);
        console.log('inserted 2 documents');
        callback(result);
    });
};

function queryFun(){

};

function deleteFun(){

};