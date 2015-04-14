var util = require('../../util.js')();
var logg;
function initServer(db){
    var express = require('express');
    var app = express();
    var server = app.listen(8100, function() {
        var appConfig = require('./config-logger/app-config.js');
        var dbConfig = require('./config-logger/db-config.js')(util.getmsdb());
        var pathConfig = require('./config-logger/path-config.js')(app, dbConfig);        
        logg = require('./module/counter.js')();
        logg.init(appConfig, dbConfig, server.address());
        console.log("Listening - ", server.address());
        require('./cron.js')(server.address().port).startCron();
    });
}
function stopTrack(){
    logg.stop();
}
function startTrack(){
    logg.start();
}
module.exports = {
    initServer : initServer,
    stopTrack : stopTrack,
    startTrack : startTrack
}