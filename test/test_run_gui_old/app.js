var express = require('express');
var request = require('request');
var bodyparser = require('body-parser');
var traffic = require('./traffic.js');
var dbCon = require('./db.js');
var reqDelay = 0;
var servers = {};
var serverList = [{
    name: 's0',
    port: 8000
}, {
    name: 's1',
    port: 8001
}, {
    name: 's2',
    port: 8002
}, {
    name: 's3',
    port: 8003
}, {
    name: 's4',
    port: 8004
}];

var serverList = [{
    name: 's0',
    port: 8000
}];

for (var i = 0; i < serverList.length; i++) {
    initServer(i);
}

function initServer(i) {
    servers[serverList[i].name] = express();
    dbCon.init(function(db){
        initInstance(servers[serverList[i].name], i);
        var server = servers[serverList[i].name].listen(serverList[i].port, function() {

            var appConfig = require('./config-logger/app-config.js');
            var dbConfig = require('./config-logger/db-config.js')(db);
            var pathConfig = require('./config-logger/path-config.js')(servers[serverList[i].name], dbConfig);
            
            require('hashlogger')().init(appConfig, dbConfig, server);
            console.log("Listening - ", server.address());
        });
    })
}

function initInstance(app, instanceNumber) { 
    app.use(bodyparser.urlencoded({ extended: false }))
    app.use(bodyparser.json());
    app.route('/').get(function(req, res, next) {
        var tags = getTags();
        Object.keys(tags).forEach(function(category) {
            var api;
            if(category == 'err'){
                api = err;
            }
            if(category == 'warn'){
                api = warn;
            }
            if(category == 'info'){
                api = info;
            }
            for(var i = 0; i< tags[category].length; i++){
                api(tags[category][i]);
            }
        });
        res.send(__dirname);
    });
    app.use('/gui',express.static(__dirname +'/gui'));
}


setTimeout(function(){
    traffic.init(1000);
});



function getRandomInt(max) {
    return Math.floor(Math.random()*max);
}
function getTags(){
    var config = {
        err :  5,
        warn : 5,
        info : 5
    }
    var returnObject = {};
    var categories = ['err', 'warn', 'info'];
    for(var i=0; i<3; i++){
        returnObject[categories[i]] = [];
        for(var j=0; j<config[categories[i]]; j++){
            var aTag = 'type'+getRandomInt(config[categories[i]])+'@';
            var totalTags = getRandomInt(3);
            for(var k=0; k<= totalTags; k++){
                aTag = aTag+'tag'+getRandomInt(config[categories[i]]);
                if(k != totalTags){
                    aTag = aTag+'#';
                }
            }
            returnObject[categories[i]].push(aTag); 
        }
    }
    return returnObject;
}