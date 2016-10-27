var http = require('http'),
    mongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/test'

module.exports = {
    Connect : function(){
        assert.equal(null, err);
        console.log('Connect to server');

        insertFun(db, function(){
            queryFun(db, function(){
                updateFun(db, function(){
                    queryFun(db, function(){
                        db.close();
                    });
                });
            });
        });
    },
    Insert: function(db, callback){
        var col = db.collection('user');
        col.insertMany([
            {a: 1}, {b:2}
        ], function(err, result){
            assert.equal(null, err);
            assert.equal(2, result.result.n);
            console.log('inserted 2 documents');
            callback(result);
        });
    },
    Query: function(db, callback){
        var col = db.collection('user');
        col.find({}).toArray(function(err, doc){
            assert.equal(null, err);
            console.log('Query result:');
            console.log(doc);
            callback(doc);
        });
    },
    Delete: function(db, callback){},
    Update: function(db, callback){
        var col = db.collection('user');
        col.updateOne({'a':1}, {$set: {'c':'newA'}}, function(err, rec){
            assert.equal(null, err);
            console.log('Update result is :');
            console.log(rec.result);
            callback(rec);
        });
    }
};
