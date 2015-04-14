var mc = require('mongodb').MongoClient;
module.exports = {
    init:function(callback) {
        mc.connect("mongodb://localhost:27017/hashlogger",function(err,db){
            if(err){
                console.log("Error creating new connection "+err);
            }
            else{
                var dbc = db;
                console.log("created new connection.in app");
                callback(dbc);
            }
        });
    }
};