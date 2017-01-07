var http = require('http'),
    mongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/test';

module.exports = {
    Connect : function(callback){
        mongoClient.connect(url, function(err, db){
            assert.equal(null, err);
            console.log('Connect to mongo server');
            if(typeof callback === 'function'){
                callback(db);
            }
            db.close();
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
    Query: function(done){
        this.Connect(function(db){
            var col = db.collection('user');
            col.find({}).toArray(function(err, doc){
                assert.equal(null, err);
                console.log('Query result:');
                console.log(doc);
                done(doc);
            });
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
