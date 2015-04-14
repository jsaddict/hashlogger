var server0app = require('./8000/app.js');

var server0cron = require('./8000/cron.js')();
function startTestServer(){
	server0app.initServer();
}
function startTracking(port){
	switch(port) {
	    case 8000:
	        server0app.startTrack();
	        console.log('started tracking 8000 ss')
	        break;
	    case "all":
	    	server0app.startTrack();
	        console.log('started tracking 8000 ss')
	}
}
function stopTracking(port){
	switch(port) {
	    case 8000:
	        server0app.stopTrack();
	        console.log('stopped tracking 8000 ss')
	        break;
	    case "all":
	    	server0app.stopTrack();
	        console.log('stopped tracking 8000 ss')
	}
}
function stopTestServer(){
	server0cron.stopCron();
	stopTracking("all")
}
module.exports = {
	startTestServer : startTestServer,
	stopTestServer : stopTestServer,
	startTracking : startTracking,
	stopTracking : stopTracking
}