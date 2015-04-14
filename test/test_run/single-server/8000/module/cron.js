var moment = require('moment');
var request = require('request');
var config, appUtil, moduleErrorHandler, extendObj, cloneObj;
// Always minInterval type array elements should be divisible by first element
// and minInterval should be a factor for 60 (if type is seconds, minutes) for 24 (if type is hours)
var trackIntervals = {
    seconds : null,
    minutes : null,
    hours : null,
    days : null,
    months : null,
    years : null
};
var cron;
var getData;
var storeData;
var getDataForAggregator;
var alertTags;
var isValidObject;
var intervalTypes = ['seconds', 'minutes', 'hours', 'days', 'months', 'years'];
//  store all declared intervals in ascending order
var trackLevels = [];
//  store intervals of trackLevels that are to be updated based on current and previousTime.
var trackTill = [];
// minInterval is combination of interval and type
var minInterval = '';

// on every interval check prev and currenttime and calculate trackTill
// On start set previousTime to the current time and set update time interval based on that.
var previousTime = null;
var nextUpdate = {};

var cronInterval = 500;
var aggregationDelay = 1000;
// "x" min before current time, "y" hours before current time ---> to get data from Db
function getOldTimestamp(type, interval, timeObject){
    var timeObj = cloneObj(timeObject);
    timeObj[type] = timeObj[type] - interval;
    timeObj['date'] = timeObj['days'];
    delete(timeObj.days);
    return parseInt(moment.utc(timeObj).valueOf()/1000);
}
// On updation of current interval, we have to update nextUpdate 
function getNextUpdateInterval(type, interval, timeObject){
    var timeObj = cloneObj(timeObject);
    timeObj[type] = timeObj[type] + interval;
    timeObj['date'] = timeObj['days'];
    delete(timeObj.days);
    var nextInterval;
    switch (type) {
        case "seconds":
            nextInterval = moment.utc(timeObj).seconds();
            break;
        case "minutes":
            nextInterval = moment.utc(timeObj).minutes();
            break;
        case "hours":
            nextInterval = moment.utc(timeObj).hours();
            break;
        case "days":
            nextInterval = moment.utc(timeObj).date();
            break;
        case "months":
            nextInterval = moment.utc(timeObj).months();
            break;
        case "years":
            nextInterval = moment.utc(timeObj).years();
            break;
        default:
            nextInterval = moment.utc(timeObj).seconds();
    }
    return nextInterval;
}

function alertTagHandler(data, timestamp){
    var val, obj;
    var alertObj = {};
    Object.keys(data).forEach(function(category) {
        Object.keys(data[category]).forEach(function(type) {
            Object.keys(data[category][type]).forEach(function(tag){
                if(isValidObject(alertTags[category+'@'+type+'#'+tag])){
                    obj = alertTags[category+'@'+type+'#'+tag];
                    val = data[category][type][tag];
                    if((obj.max != null && val > obj.max) || (obj.min != null && val < obj.min)){
                        if(typeof alertObj[category] === 'undefined'){
                            alertObj[category] = {};
                        }
                        if(typeof alertObj[category][type] === 'undefined'){
                            alertObj[category][type] = {};
                        }
                        alertObj[category][type][tag] = val;
                    }
                }
            });
        });
    });
    storeData('alerts', '', timestamp, alertObj, function(err, response){
        if(err){
            return moduleErrorHandler({
                        name : 'no-track',
                        type : 'err',
                        message : 'error storing alert data',
                        errorObj : err
                    });
        }
    })
}
function aggregate(dataArray){

    var len = dataArray.length;
    var total = {};
    for(var i=0;i<len;i++){
        var data = dataArray[i].data;
        Object.keys(data).forEach(function(category) {
            if(typeof total[category] === 'undefined'){
                total[category] = {};
            }
            Object.keys(data[category]).forEach(function(type) {
                if(typeof total[category][type] === 'undefined'){
                    total[category][type] = {};
                }
                Object.keys(data[category][type]).forEach(function(tag){
                    if(typeof total[category][type][tag] === 'undefined'){
                        total[category][type][tag] = data[category][type][tag];
                    }else
                    if((typeof total[category][type][tag] === 'number') && (typeof data[category][type][tag] === 'number')){
                        total[category][type][tag] = total[category][type][tag]+data[category][type][tag];
                    }
                });
            });
        });
    }
    return total;
}
function aggregateData(type, intervalArray, updateIntervalInfo, fn){
    if(intervalArray.length === 0){
        return fn(null, {});
    }else{
        var dataInterval = intervalArray.shift();
        var timeValue = updateIntervalInfo.time[type];
        if(nextUpdate[type][dataInterval] == timeValue){
            // update nextUpdate value
            nextUpdate[type][dataInterval] = getNextUpdateInterval(type, dataInterval, updateIntervalInfo.time);
            
            var dataTimestamp = updateIntervalInfo.timestamp;
            getDataForAggregator(type, dataInterval, getOldTimestamp(type, dataInterval, updateIntervalInfo.time), dataTimestamp, function(err, dataArray){
                if(err){
                    return fn(err)
                }else{
                    storeData(
                        type,
                        dataInterval,
                        dataTimestamp,
                        aggregate(dataArray),
                        function(err, response){
                            if(err){
                                return fn(err)
                            }else{
                                aggregateData(type, intervalArray, updateIntervalInfo, fn);
                            }
                        }
                    )
                }
            })
        }else{
            aggregateData(type, intervalArray, updateIntervalInfo, fn);
        }        
    }
}
function updateData(updateIntervalInfo, fn){
    if(updateIntervalInfo.track.length === 0){
        return fn(null, {});
    }
    var track = updateIntervalInfo.track[0];
    var intervalArray = trackIntervals[track].slice();
    // We skip minInterval updation, as we are doing it in initUpdate.
    if(track == minInterval.type){
        intervalArray.shift();
    }
    aggregateData(track, intervalArray, updateIntervalInfo, function(err, response){
        if(err){
            return fn(err);
        }else{
            updateIntervalInfo.track.shift();
            if(updateIntervalInfo.track.length === 0){
                return fn(null, {})
            }else{
                updateData(updateIntervalInfo, fn);
            }            
        }
    });
}
function initUpdate(updateIntervalInfo, data){
    storeData(
        minInterval.type,
        minInterval.interval,
        updateIntervalInfo.timestamp,
        data.data,
        function(err, response){
            if(err){
                return moduleErrorHandler({
                                name : 'no-track',
                                type : 'err',
                                message : 'error storing data',
                                errorObj : err
                            });
            }else{            
                updateData(updateIntervalInfo, function(err, response){
                    if(err){
                        return moduleErrorHandler({
                                name : 'no-track',
                                type : 'err',
                                message : 'error while updating data',
                                errorObj : err
                            });
                    }else{

                    }
                });
            }
        }
    )   
}
function getTimeObject(timestamp){
    var timeObj = {};
    var utc = moment.utc(timestamp*1000);
    timeObj.seconds = utc.seconds();
    timeObj.minutes = utc.minutes();
    timeObj.hours = utc.hours();
    timeObj.days = utc.date();
    timeObj.months = utc.months();
    timeObj.years = utc.years();
    return timeObj;
}
function isUpdatableInterval(){
    var returnObject = {};
    var timestamp = Math.floor(moment.utc().valueOf()/1000);
    var currentTime = getTimeObject(timestamp);
    returnObject.timestamp = timestamp;
    returnObject.time = currentTime;
    var track = [];
    if(currentTime[minInterval.type] == nextUpdate[minInterval.type][minInterval.interval]){ 
        nextUpdate[minInterval.type][minInterval.interval] = getNextUpdateInterval('seconds', minInterval.interval, currentTime);
        for(var i=0; i< trackLevels.length; i++){
            if(previousTime[trackLevels[i]] == currentTime[trackLevels[i]]){
                break;
            }else{
                track.push(trackLevels[i]);
            }
        }
        previousTime = currentTime;
    } 
    if(track.length === 0){
        returnObject.update = false;
    }else{
        returnObject.update = true;
    }
    returnObject.track = track.slice();
    return returnObject;
}
function initPreviousTime(){
    previousTime = getTimeObject(moment.utc().valueOf()/1000);
}
function initNextUpdate(){
    initPreviousTime();
    Object.keys(previousTime).forEach(function(type) {       
        if(typeof trackIntervals[type] !== 'undefined'){
            nextUpdate[type] = {};
            var intervalArray = trackIntervals[type];
            for(var i=0; i<intervalArray.length;i++){
                nextUpdate[type][intervalArray[i]] = getNextUpdateInterval(type, intervalArray[i], previousTime)
            }
        }        
    });
}
function init(startUpdate, callback){ 
    cron = setInterval(function(){
        var updateIntervalInfo = isUpdatableInterval();
        if(updateIntervalInfo.update){
            startUpdate(aggregationDelay, updateIntervalInfo, function(updateIntervalInfo, data){
                initUpdate(updateIntervalInfo, data);
                if(isValidObject(alertTags)){
                    alertTagHandler(data.data,updateIntervalInfo.timestamp);
                }   
            });
        }        
    },cronInterval)
    initNextUpdate();
}
function stop(){
    clearInterval(cron);
}
function setTrackLevels(){
    for(var i=0; i<intervalTypes.length; i++){
        if(typeof trackIntervals[intervalTypes[i]] !== 'undefined'){
            trackLevels.push(intervalTypes[i]);
        }
    }
}
function setMinInterval(){
    trackIntervals = config.interval;
    minInterval = {
        type : trackLevels[0],
        interval : trackIntervals[trackLevels[0]][0]
    }
}
module.exports = function(appConfiguration, appUtilities){
    config = appConfiguration;
    appUtil = appUtilities;
    isValidObject  = appUtil.isValidObject;
    extendObj = appUtil.extendObj;
    cloneObj = appUtil.cloneObj;
    alertTags = config.alert;
    moduleErrorHandler = appUtil.moduleErrorHandler;
    storeData = config.db.storeData;
    getData = config.db.getData;
    getDataForAggregator = config.db.getDataForAggregator;
    

    setTrackLevels();
    setMinInterval();

    return {
        init : init,
        stop : stop
    };
}