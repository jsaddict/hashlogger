var request = require('request');
var util = require('util');
var computeConfig = require('./compute-config.js');

var config = {};
var handleAggregation;
var cron;
var isAggregationServer = false;
var aggregationData = {
	err : {},
	warn : {},
	info : {}
};
// on starting and stopping the track we have to keep track of old user defined config.
var oldTrackConfig = {}
module.exports = function(){
	
	var aggregatorToken, 
		aggregatorUrl,
		alertHandlerUrl,
		moduleErrorHandler,
		isValidObject,
		serverInfo,
		instanceDataHandler,
		aggregateDataHandler,
		getInstanceData, 
		aggregationQ,
		returnObject = {};

	var getTags,
		updateTags,
		storeData,
		getData;

	var err, warn, info;


	function aggregate(data){
		isAggregationServer = true;
		Object.keys(data).forEach(function(category) {
			Object.keys(data[category]).forEach(function(type) {
				if(typeof aggregationData[category][type] === "undefined"){
					aggregationData[category][type] = {};
					aggregationData[category][type]['tag-total'] = 0;
				}
				Object.keys(data[category][type]).forEach(function(tag){
					if(typeof aggregationData[category][type][tag] === "undefined"){
						aggregationData[category][type][tag] = data[category][type][tag];
					}else{
						aggregationData[category][type][tag] = aggregationData[category][type][tag]+data[category][type][tag];
					}
					aggregationData[category][type]['tag-total'] = aggregationData[category][type]['tag-total'] + data[category][type][tag];
				});
			});
	    });
	}

	function resetAggregationData(){
		var data = {};
		data.data = aggregationData;
		if(aggregateDataHandler){
			aggregateDataHandler(config, serverInfo, aggregationData);
		}
		updateTagsData(aggregationData, function(err, response){
			if(err){
				return moduleErrorHandler({
							name : 'no-info',
							type : 'err',
							message : 'error updating tags',
							errorObj : err
						});
			}
		});
			
		aggregationData = {
			err : {},
			warn : {},
			info : {}
		};
		return data;
	}

	// To collect all the tags those are encountered
	function updateTagsData(data){
		var tagsFromServer;
		getTags(function(err, tags){
			if(err){
				return moduleErrorHandler({
							name : 'no-track',
							type : 'err',
							message : 'error while getting tags',
							errorObj : err
						});
			}
			tagsFromServer = tags;
			if(tags === null){
				tagsFromServer = {};
			}			
	        Object.keys(data).forEach(function(category) {
	        	if(typeof tagsFromServer[category] === "undefined"){
					tagsFromServer[category] = {};
				}
				Object.keys(data[category]).forEach(function(type) {
					if(typeof tagsFromServer[category][type] === "undefined"){
						tagsFromServer[category][type] = [];
					}
					Object.keys(data[category][type]).forEach(function(tag){
						if(tagsFromServer[category][type].indexOf(tag) == -1){
							tagsFromServer[category][type].push(tag);
						}
					});
				});
		    });
		    updateTags(tagsFromServer, function(err, response){
		    	if(err){
		    		return moduleErrorHandler({
							name : 'no-track',
							type : 'err',
							message : 'error while updating tags',
							errorObj : err
						});
		    	}
		    })
		});
	}

	
	function handleAggregation(data){
		aggregate(data);
	}

	function sendInstanceData(){
		var data = {};
		data.data = getInstanceData();
		if(instanceDataHandler){
			instanceDataHandler(config, serverInfo, data);
		}
		data.token = aggregatorToken;
		request.post({
		    uri:aggregatorUrl,
		    json:true,
		    body:data
		});
	}

	function setApi(){
		global[config.api.err] = err;
		global[config.api.warn] = warn;
		global[config.api.info] = info;
	}


	//Start sending instance data --> aggregate data ---> collect data by resetAggregationData() after some delay
	function startUpdation(delay, updateIntervalInfo, fn){
		sendInstanceData();
		setTimeout(function(){
			if(isAggregationServer){
				fn(updateIntervalInfo, resetAggregationData());
			}
		}, delay);
	}

	function init(appConfig, dbConfig, serverDetails){
		computeConfig(config, appConfig, dbConfig);
		var appUtil = require('./app-util.js')(config);
		var api = require('./api.js')(config, appUtil);
		cron = require('./cron.js')(config, appUtil);

		if(typeof config.instanceDataHandler !== 'function'){
			instanceDataHandler = false;
		}else{
			instanceDataHandler = config.instanceDataHandler
		}

		if(typeof config.aggregateDataHandler !== 'function'){
			aggregateDataHandler = false;
		}else{
			aggregateDataHandler = config.aggregateDataHandler
		}
		
		if(typeof serverDetails === 'undefined'){
			serverInfo = null;
		}else{
			serverInfo = serverDetails;
		}

		aggregatorToken = config.aggregatorToken;	
		aggregatorUrl = config.aggregatorUrl;

	    alertTags = config.alert;
	    alertHandlerUrl = config.alertHandlerUrl;
		
		moduleErrorHandler = appUtil.moduleErrorHandler;
		isValidObject = appUtil.isValidObject;

		err = api.err;
		warn = api.warn;
		info = api.info;
		getInstanceData = api.getInstanceData;

		getTags = config.db.getTags;
		updateTags = config.db.updateTags;
		storeData = config.db.storeData;
		getData = config.db.getData;

		oldTrackConfig.err = config.err.track;
		oldTrackConfig.warn = config.warn.track;
		oldTrackConfig.info = config.info.track;

		setApi();
		cron.init(startUpdation);
	}

	function start(){
		cron.init(startUpdation);
		config.err.track = oldTrackConfig.err;
		config.warn.track = oldTrackConfig.warn;
		config.info.track = oldTrackConfig.info;
	}
	function stop(){
		cron.stop();
		config.err.track = false;
		config.warn.track = false;
		config.info.track = false;
		aggregationData = {
			err : {},
			warn : {},
			info : {}
		};
	}    

	function returnObj(){		
		returnObject.handleAggregation = handleAggregation;
		returnObject.init = init;
		returnObject.start = start;
		returnObject.stop = stop;
		return returnObject;
	}
	return returnObj();
}