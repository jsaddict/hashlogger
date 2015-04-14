var config = require('../../config.js');
var util = require('../../util.js')();
var getTag = util.getTag;
var interval = config.ms.delay;
var cron,port;
function startCron(){
	cron = setInterval(function(){
		err(getTag('ss', 'err'))
		warn(getTag('ss', 'warn'))
		info(getTag('ss', 'info'))
	}, interval);
	console.log('port started ',port)
}
function stopCron(){
	clearInterval(cron);
	console.log('port stopped ',port)	
}
module.exports = function(serverPort){
	if(arguments.length ==1){
		port = serverPort;
	}
	return {
		startCron : startCron,
		stopCron : stopCron
	}
}
