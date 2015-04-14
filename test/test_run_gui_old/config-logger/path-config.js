var logger = require('../module/counter.js')();
var jsonParser = require('body-parser').json();
var aggregatorToken = 'logger-token';
var app;
var getTags, 
	getData,
	getRecentData;
function getPlotFormat(data){
	var len = data.length;
	for(var i=0;i<len;i++){
		data[i].time = data[i]._id;
		delete data[i]._id;
	}
	return data;
}
function setAggregationPath(){
	app.post('/aggregate', jsonParser, function(req,res,next){
		if(req.body.token == aggregatorToken){
			logger.handleAggregation(req.body.data);
			res.send('hi');
		}else{
			res.send('invalid');
		}
	});
}

function setPlotPaths(){
	app.get('/get-tags', function(req,res,next){
		getTags(function(err, tags){
			if(err){
				res.json({
					status : 'error',
					reason : 'error while getting tags from db'
				});
			}else{
				res.json(tags);
			}
		})
	});
	/*
	query = {
		format : 'interval/recent/timestamp',
		type : 'seconds',
		interval : 5,
		timestamp : timestamp, (timestamp)
		from : timestamp, (interval)
		to : timestamp, (interval)
		count : number (recent) 
	}
	*/
	app.get('/plot-data', function(req, res, next){
		var format, type, interval, from, to, count, timestamp;		
		var query = req.query;
		format = query.format;
		type = query.type;
		interval = parseInt(query.interval);
		if(format == 'interval'){			
			from = parseInt(query.from);
			to = parseInt(query.to);
			getData(type, interval, from, to, function(err, data){	
				if(err){
					res.json({
						status : 'error',
						reason : 'error while getting interval data from db'
					});
				}else{
					res.json(getPlotFormat(data))
				}
			});
		}else
		if(format == 'recent'){
			count = parseInt(query.count);
			getRecentData(type, interval, count, function(err, data){
				if(err){
					res.json({
						status : 'error',
						reason : 'error while getting recent data from db'
					});
				}else{
					res.json(getPlotFormat(data))
				}
			});
		}else
		if(format == 'timestamp'){
			from = parseInt(query.timestamp);
			to = null;
			getData(type, interval, from, to, function(err, data){
				if(err){
					res.json({
						status : 'error',
						reason : 'error while getting recent data from db'
					});
				}else{
					res.json(getPlotFormat(data))
				}
			});
		}else{
			res.json({
				status : 'error',
				reason : 'format should be either interval or recent'
			});
		}
	})
}
module.exports = function(appInstance, dbConfig){
	app = appInstance;
	getTags = dbConfig.getTags;
	getData = dbConfig.getData;
	getRecentData = dbConfig.getRecentData;
	setAggregationPath();
	setPlotPaths();
	return {}
}