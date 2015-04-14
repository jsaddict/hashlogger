var server0app = require('./8100/app.js');
var server1app = require('./8101/app.js');
var server2app = require('./8102/app.js');
var server3app = require('./8103/app.js');

var server0cron = require('./8100/cron.js')();
var server1cron = require('./8101/cron.js')();
var server2cron = require('./8102/cron.js')();
var server3cron = require('./8103/cron.js')();
function startTestServer(){
	server0app.initServer();
	server1app.initServer();
	server2app.initServer();
	server3app.initServer();
}
function startTracking(port){
	switch(port) {
	    case 8100:
	        server0app.startTrack();
	        console.log('started tracking 8100 ms')
	        break;
	    case 8101:
	        server1app.startTrack();
	        console.log('started tracking 8101 ms')
	        break;
	    case 8102:
	        server2app.startTrack();
	        console.log('started tracking 8102 ms')
	        break;
	    case 8103:
	        server3app.startTrack();
	        console.log('started tracking 8103 ms')
	        break;
	    case "all":
	    	server0app.startTrack();
	        console.log('started tracking 8100 ms')
	        server1app.startTrack();
	        console.log('started tracking 8101 ms')
	        server2app.startTrack();
	        console.log('started tracking 8102 ms')
	        server3app.startTrack();
	        console.log('started tracking 8103 ms')
	}
}
function stopTracking(port){
	switch(port) {
	    case 8100:
	        server0app.stopTrack();
	        console.log('stopped tracking 8100 ms')
	        break;
	    case 8101:
	        server1app.stopTrack();
	        console.log('stopped tracking 8101 ms')
	        break;
	    case 8102:
	        server2app.stopTrack();
	        console.log('stopped tracking 8102 ms')
	        break;
	    case 8103:
	        server3app.stopTrack();
	        console.log('stopped tracking 8103 ms')
	        break;
	    case "all":
	    	server0app.stopTrack();
	        console.log('stopped tracking 8100 ms')
	        server1app.stopTrack();
	        console.log('stopped tracking 8101 ms')
	        server2app.stopTrack();
	        console.log('stopped tracking 8102 ms')
	        server3app.stopTrack();
	        console.log('stopped tracking 8103 ms')
	}
}
function stopTestServer(){
	server0cron.stopCron();
	server1cron.stopCron();
	server2cron.stopCron();
	server3cron.stopCron();
	stopTracking("all")
}
module.exports = {
	startTestServer : startTestServer,
	stopTestServer : stopTestServer,
	startTracking : startTracking,
	stopTracking : stopTracking
}