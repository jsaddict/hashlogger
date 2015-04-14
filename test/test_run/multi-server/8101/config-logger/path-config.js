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
	// console.log(data);
	return data;
}
function setAggregationPath(){
	app.post('/aggregate', jsonParser, function(req,res,next){
		if(req.body.token == aggregatorToken){
			// console.log('aggregator data --->', req.body.data);
			// console.log('handleAggregation --->', logger.handleAggregation);
			logger.handleAggregation(req.body.data);
			res.send('hi');
		}else{
			res.send('invalid');
		}
	});
}

function setPlotPaths(){
	app.get('/get-tags', function(req,res,next){
		console.log('>>>>>>>>>get tags called');
		getTags(function(err, tags){
			if(err){
				res.json({
					status : 'error',
					reason : 'error while getting tags from db'
				});
			}else{
				// console.log('>>>>>>>>>returned tags', tags);
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
		console.log('$$$$$$$$$$$$db from data',req.query)
		var format, type, interval, from, to, count, timestamp;		
		var query = req.query;
		format = query.format;
		type = query.type;
		interval = parseInt(query.interval);
		if(format == 'interval'){			
			from = parseInt(query.from);
			to = parseInt(query.to);
			getData(type, interval, from, to, function(err, data){
				// console.log('$$$$$$$$$$$$db from data',type, interval, from, to, data)	
				if(err){
					res.json({
						status : 'error',
						reason : 'error while getting interval data from db'
					});
				}else{
					// console.log('$$$$$$$$$$$$db from data',data)					
					console.log('$ $$ $$ $$ data',data)
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
					// console.log('$$$$$$$---------$$$$$db from data',data)
					res.json(getPlotFormat(data))
				}
			});
		}else
		if(format == 'timestamp'){
			// timestamp = parseInt(query.timestamp);
			// from = parseInt(query.from);
			from = parseInt(query.timestamp);
			to = null;
			// console.log('timestamp, from', timestamp, from)
			getData(type, interval, from, to, function(err, data){
				if(err){
					res.json({
						status : 'error',
						reason : 'error while getting recent data from db'
					});
				}else{
					// console.log('$$$$$$$---------$$$$$db from data',data)
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
/*
// GET /search?q=tobi+ferret
req.query.q
// => "tobi ferret"

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
req.query.order
// => "desc"

req.query.shoe.color
// => "blue"

req.query.shoe.type
// => "converse"
*/