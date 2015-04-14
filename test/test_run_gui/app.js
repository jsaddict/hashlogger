var express = require('express');
var request = require('request');
var dbCon = require('./db.js');
var app;
app = express();
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
    res.send('hi');
});
app.use('/gui',express.static(__dirname +'/gui'));
dbCon.init(function(db){
    var server = app.listen(8000, function() {

        var appConfig = require('./config-logger/app-config.js');
        var dbConfig = require('./config-logger/db-config.js')(db);
        var pathConfig = require('./config-logger/path-config.js')(app, dbConfig);
        
        require('./module/counter.js')().init(appConfig, dbConfig, server);
        console.log("Listening - ", 8000);
    });
})


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
function requester(){
    request.get({uri:'http://localhost:8000'});
    setTimeout(requester,delay);
}
function init(interval){
    delay = interval;
    setTimeout(requester,delay);
}
setTimeout(function(){
    init(1000);
});