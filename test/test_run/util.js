var assert = require('assert');
var maxTypes = 1;
var maxTags = 1;
var maxTagString = 1;
var logData = false;
var isTrackTest = false;
var totalTags = {
    ss : { err : {}, warn : {}, info : {}},
    ms : { err : {}, warn : {}, info : {}}
};
var totalData = {
	ss : { err : {}, warn : {}, info : {}},
	ms : { err : {}, warn : {}, info : {}}
}
var tempData = {
    ss : { err : {}, warn : {}, info : {}},
    ms : { err : {}, warn : {}, info : {}}
}
var ssdbConnection, msdbConnection;
function isValidObject(obj) {
    if (typeof obj == 'object' && obj != null) {
        return true;
    } else {
        return false;
    }
}

function isValidArray(arr) {
    if (typeof arr == 'object' && arr instanceof Array) {
        return true;
    } else {
        return false;
    }
}

function isValidNumber(num) {
    if (typeof num == 'number' && !isNaN(num)) {
        return true;
    } else {
        return false;
    }
}
function cloneObj(obj) {
    if(!isValidObject(obj)){
        // obj = {};
        return obj;
    }else{
        if (obj instanceof Array) {
            return obj.slice();
        } else {
            if(Object.keys(obj).length == 0){
                return {};
            }else{
                var cloned = extend({}, obj);
                return cloned;
            }
        }
    }
}

function extendObj(target, source) {
    if(!isValidObject(target)){
        target = {};
    }
    if(!isValidObject(source)){
        source = {};
    }
    var clonedTarget = extend({}, target);
    var extended = extend(clonedTarget, source)
    return extended;
}

function extend(target, source) {
    target = target || {};
    for (var prop in source) {
        if (isValidObject(source[prop])) {
            if (source[prop] instanceof Array) {
                target[prop] = source[prop].slice()
            } else {
                if(Object.keys(source[prop]).length == 0){
                    target[prop] = {};
                }else{
                    target[prop] = extend(target[prop], source[prop]);
                }
            }
        } else {
            target[prop] = source[prop];
        }
    }
    return target;
}
function add(serverType, data){
    Object.keys(data).forEach(function(category) {
        if(typeof tempData[serverType][category] == 'undefined'){
            tempData[serverType][category] = {};
        }
        Object.keys(data[category]).forEach(function(type) {
            if(typeof tempData[serverType][category][type] == 'undefined'){
                tempData[serverType][category][type] = {};
            }
            Object.keys(data[category][type]).forEach(function(tag){
                if(typeof tempData[serverType][category][type][tag] == 'undefined'){
                    tempData[serverType][category][type][tag] = data[category][type][tag];
                }else
                if((typeof tempData[serverType][category][type][tag] == 'number') && (typeof data[category][type][tag] == 'number')){
                    tempData[serverType][category][type][tag] = tempData[serverType][category][type][tag]+data[category][type][tag];
                }
            });
        });
    });
}
function computeTagTotal(obj){
    Object.keys(obj).forEach(function(category){
        Object.keys(obj[category]).forEach(function(type){
            var tagTotal = 0;
            Object.keys(obj[category][type]).forEach(function(tag){
                if(typeof obj[category][type][tag] == 'number'){
                    tagTotal = tagTotal + obj[category][type][tag];
                }                
            });
            obj[category][type]['tag-total'] = tagTotal;
        });
    });
    return obj;
}
function resetData(serverType, dataType){
	var data;
	if(dataType == 'total'){
		data = computeTagTotal(cloneObj(totalData[serverType]));
		totalData[serverType] = { err : {}, warn : {}, info : {}};
		return data;
	}else{
		data = computeTagTotal(cloneObj(tempData[serverType]));
		tempData[serverType] = { err : {}, warn : {}, info : {}};
		return data;
	}
}
function getTag(server, api){
	var tag, tagString = '';
	var type = 'type'+Math.round(Math.random()*maxTypes);
	var tagsLength = Math.round(Math.random()*maxTags);
	if(typeof totalData[server][api][type] == "undefined"){
		totalData[server][api][type] = {};
        totalTags[server][api][type] = ['tag-total'];
	}
	for(var i=0; i<tagsLength; i++){
		tag = 'tag'+Math.round(Math.random()*maxTags);
		if(typeof totalData[server][api][type][tag] == "number"){
			totalData[server][api][type][tag]++;
		}else{
			totalData[server][api][type][tag] = 1;
            totalTags[server][api][type].push(tag);
		}
		tagString = tagString+tag;
		if(i != tagsLength-1){
			tagString = tagString+'#';
		}
	}
	if(tagsLength == 0){
		if(typeof totalData[server][api][type]['no-tag'] == "number"){
			totalData[server][api][type]['no-tag']++;
		}else{
			totalData[server][api][type]['no-tag'] = 1;
            totalTags[server][api][type].push('no-tag');
		}
		return type;
	}else{
		return type+'@'+tagString;
	}
}
function checkInstanceHandler(serverType, data, serverDetails){
    console.log('   Instance Data ',serverType, serverDetails.port);
    if(logData){
        console.log(data.data);
    }
    add(serverType, data.data)
}
function checkAggregationHandler(serverType, data, serverDetails){
    var aggregatedData = resetData(serverType, 'temp');
    console.log(' + Aggregator Data ',serverType, serverDetails.port);
    if(logData){
        console.log(data);
        console.log(' = Expected Data ',serverType, serverDetails.port);
        console.log(aggregatedData);
    }
    if(testTrack == false){
        assert.deepEqual(aggregatedData, data)
    }        
}
function getTotalTags(){
    return totalTags;
}
function getTotalData(){
    return totalData;
}
function getssdb(){
    return ssdbConnection;
}
function getmsdb(){
    return msdbConnection;
}
module.exports = function(ssdb, msdb, logAll, isTrackTest){
    if(arguments.length == 4){
        ssdbConnection = ssdb;
        msdbConnection = msdb;
        logData = logAll;
        testTrack = isTrackTest;
    }    
    return {
        getTag : getTag,
        checkInstanceHandler : checkInstanceHandler,
        checkAggregationHandler : checkAggregationHandler,
        getTotalTags : getTotalTags,
        getTotalData : getTotalData,
        getssdb : getssdb,
        getmsdb : getmsdb
    }
}
