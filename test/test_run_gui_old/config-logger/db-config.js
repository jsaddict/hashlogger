/**
 *
 * Declarations
 *
 */
var collectionNames = {
	seconds : "seconds",
    minutes : "minutes",
    hours : "hours",
    days : "days",
    months : "months",
    years : "years",
    tags : "tags",
    alerts : "alerts"
};
var interval={
    seconds : [2, 10, 30],
    minutes : [1, 15, 30],
    hours : [1, 6, 12],
    days : [1, 7],
    months : [1, 3, 4],
    years : [1]
}
var minInterval = {
    type : 'seconds',
    interval : 2
}
var intervalTypes = ["seconds", "minutes", "hours", "days", "months", "years"];
// var dbSeconds, dbMinutes, dbHours, dbAlerts, dbTags;
var db = {};
var dbAlerts, dbTags;

/**
 *
 * 
 * Helper Functions
 *
 * 
 */

function setCollections(dbCon){
    Object.keys(interval).forEach(function(level) {
        for(var i=0; i<interval[level].length; i++){
            // console.log('dbs---->'level, ,level+interval[level[i]]);
            db[level+interval[level][i]] = dbCon.collection(level+interval[level][i]);
        }
    });
    dbTags = dbCon.collection(collectionNames.tags);
    db['alerts'] = dbCon.collection(collectionNames.alerts);
    // console.log('dbs---->',Object.keys(db));
}
function getDataForAggregatorInfo(currentType, currentInterval){
    var infoType, infoInterval;
    switch (currentType) {
        case "seconds":
            if(currentInterval == 15){
                infoType = 'seconds';
                infoInterval = 5;
            }
            if(currentInterval == 30){
                infoType = 'seconds';
                infoInterval = 15;
            }
            break;
        case "minutes":
            // some times 30 seconds may not be available for next minute.
            if(currentInterval == 1){
                // infoType = 'seconds';
                // infoInterval = 30;
                infoType = 'seconds';
                infoInterval = 5;
            }
            if(currentInterval == 15){
                infoType = 'minutes';
                infoInterval = 1;
            }
            if(currentInterval == 30){
                infoType = 'minutes';
                infoInterval = 15;
            }
            break;
        case "hours":
        // some times 30 minutes may not be available for next minute.
            if(currentInterval == 1){
                // infoType = 'minutes';
                // infoInterval = 30;
                infoType = 'minutes';
                infoInterval = 1;
            }
            if(currentInterval == 6){
                infoType = 'hours';
                infoInterval = 1;
            }
            if(currentInterval == 12){
                infoType = 'hours';
                infoInterval = 6;
            }
            break;
        case "days":
        // some times 12 hours may not be available for next minute.
            if(currentInterval == 1){
                // infoType = 'hours';
                // infoInterval = 12;
                infoType = 'hours';
                infoInterval = 1;
            }
            if(currentInterval == 7){
                infoType = 'days';
                infoInterval = 1;
            }
            break;
        case "months":
            if(currentInterval == 1){
                infoType = 'days';
                infoInterval = 1;
            }
            if(currentInterval == 3 || currentInterval == 4){
                infoType = 'months';
                infoInterval = 1;
            }
            break;
        case "years":
            infoType = 'months';
            infoInterval = 4;
            break;
        default:
            infoType = 'seconds';
            infoInterval = 5;
    }
    // console.log('^^^^^>>>data for aggregator switch currentType, currentInterval, type, interval', currentType, currentInterval, infoType, infoInterval)
    return {
        type : infoType,
        interval : infoInterval
    }
}

/**
 *
 * 
 * API Functions
 *
 * 
 */

function getTags(fn){
    dbTags.findOne({name :'tags'}, function(err, tags) {
        if(err){
            // console.log('+++++tags Error');
            return fn(err);
        }else{
            // console.log('+++++tags', tags);
            if(tags == null){
                dbTags.insertOne({ name :'tags', tags : null},function(err, tags){
                    if(err){

                    }else{
                        // console.log('&&&&&&after insertion null ', tags)
                        return fn(null, null);
                    }
                })
            }else{
                // console.log('&&&&&&after insertion tags', tags)
                return fn(null, tags.tags)
            }           
        }
    });
}
function updateTags(tags, fn){
    // console.log('+++++update-tags', tags);
    dbTags.updateOne({name :'tags'},{$set: {tags: tags}} , function(err, tags, other) {
        if(err){
            return fn(err);
        }else{
            // console.log('+++++update-tags---', err, tags, other, "+++++++++end update tags");
            return fn(null, tags)
        }
    });
}
function getData(type, interval, from, to, fn){ 
    // console.log( 'type , interval, from, to ', type, interval, from, to);
    if(typeof db[type+interval] != 'undefined'){
        var collection, query;
        if(type == 'alerts'){
            collection = 'alerts'
        }else{
            collection = type+interval;
        }
        if(to == null){
            query = {$gt: from};
        }else{
            query = {$gt: from, $lte: to};
        }
        db[collection].find( {_id:query}).toArray(function(err, docs) {
            // console.log('%%%%db {_id:query} ',query,err, docs);
            if(err){
                return fn(err)
            }else{
                return fn(null, docs);
                // console.log('%%%%db {_id:query} ',query);
                // console.log('%%%%db output ',docs);
            }
        });
    }else{
        return fn(new Error('improper interval'))
    }    
}
function getRecentData(type, interval, count, fn){
    if(typeof db[type+interval] != 'undefined'){
        var collection = type+interval;
        if(type == 'alerts'){
            collection = 'alerts'
        }
        db[collection].find().sort({
            _id: -1
        }).limit(count).toArray(function(err, docs) {
            if (err) {
                return fn(err)
            }
            // console.log('%%%%db output ',docs);
            if (docs) {                
                return fn(null, docs);
            }
        });
    }else{
        return fn(new Error('improper interval'))
    } 
}
function getDataForAggregator(type, interval, from, to, fn){
    var info = getDataForAggregatorInfo(type, interval);
    type = info.type;
    interval = info.interval;
    getData(type, interval, from, to, function(err, docs){
        if(err){
            return fn(err)
        }else{
            return fn(null, docs);
        }
    })
}
function storeData(type, interval, timestamp, data, fn){
    if(typeof db[type+interval] != 'undefined'){
        var collection = type+interval;
        if(type == 'alerts'){
            collection = 'alerts'
        }
        // console.log('collection',collection)
        db[collection].insertOne({_id: timestamp, data: data}, function(err, docs) {
            if(err){
                return fn(err)
            }else{
                console.log('<><><><><>stored '+type+' interval '+interval);
                return fn(null, {});
            }
        });
    }else{
        return fn(new Error('improper interval'))
    } 
}
module.exports = function(dbInstance){
    setCollections(dbInstance);
	
	return {
		getTags : getTags,
	    updateTags : updateTags,
	    getData : getData,
	    storeData : storeData,
        getDataForAggregator : getDataForAggregator,
        getRecentData : getRecentData
	}
}