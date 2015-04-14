lastTimestamp = null;
queryObj = {
    format : 'timestamp',
    type : minInterval.type,
    interval : minInterval.interval,
    timestamp : null
}
var firstQueryObj = {
    format : 'recent',
    type : minInterval.type,
    interval : minInterval.interval,
    count : 1 
}
var currentData = null;
var numSeriesFailures = 0;
var stopUpdation = false;
function getDataFromServer(obj, fn){
    $.ajax({
        url: dataUrl,
        data : obj,
        type: "GET",
        dataType: "json",
        timeout: 5000,
        success: function(data) {
            numSeriesFailures = 0;
            if(isValidArray(data)){
                if(data.length ==0){
                    return fn(null, null);
                }else{
                    return fn(null, data[0]);
                }
                
            }else
            if(data == null){
                postInfo('info','No data received : Received null from server');
                return fn(null, null);
            }else{
                postInfo('err','Received non-object from server');
                return fn(null, null);
            }                    
        },
        error: function(x, t, m) {
            numSeriesFailures++;
            if(t == "timeout") {
                postInfo('err','timeout receiving data from server. check again',obj);
            } else {
                postInfo('err','error happend while receiving data from server',obj);
            }
            if(maxUpdateFailures == numSeriesFailures){
                stopUpdation = true;
                setTimeout(function(){
                    postInfo('err','Stopped updating !!! reload and check the server  ( ˘︹˘ )');
                },3000)               
            }
            return fn(new Error('error happend while receiving data from server'));
        }
    });
}
function getCount(category, type, tag){
    if(isValidObject(currentData)){
        if(isValidObject(currentData[category])){
            if(isValidObject(currentData[category][type])){
                if(isValidNumber(currentData[category][type][tag])){
                    return currentData[category][type][tag];
                }else{
                    return 0;
                }
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    }else{
        return 0;
    }
}
function isThresholdAlert(tag, count){
    var alertObj;
    if(isValidObject(alertTags)){
        if(isValidObject(alertTags[tag])){
            alertObj = alertTags[tag];
            if((alertObj.max != null && count > alertObj.max) || (alertObj.min != null && count < alertObj.min)){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    }else{
        return false;
    }
}
function plotData(data){
    var tagCount, isAlert, wrapperClass;
    if(isValidObject(tagsToBePlotted)){
        Object.keys(tagsToBePlotted).forEach(function(category) {
            Object.keys(tagsToBePlotted[category]).forEach(function(type){
                var template = '';
                var typeArray,tag;
                if(isValidArray(tagsToBePlotted[category][type])){
                    typeArray = tagsToBePlotted[category][type];
                    for(var i=0;i<typeArray.length;i++){
                        tag = typeArray[i];
                        tagCount = getCount(category,type,tag);
                        isAlert = isThresholdAlert(category+'@'+type+'#'+tag, tagCount);
                        wrapperClass = (isAlert == false) ? "tag-grid" : "tag-grid threshold";

                        template = template+'<div class="'+wrapperClass+'"><div class="tag-type">'+type+'</div><div class="tag-name">'+tag+'</div><div class="tag-count">'+tagCount+'</div></div>'
                    }
                }
                $('#'+category+'-tag-container').html(template);
            });
        }); 
    }else{
        Object.keys(data).forEach(function(category) {
            Object.keys(data[category]).forEach(function(type){
                var template = '';
                Object.keys(data[category][type]).forEach(function(tag){
                    tagCount = parseInt(data[category][type][tag]);
                    isAlert = isThresholdAlert(category+'@'+type+'#'+tag, tagCount);
                    wrapperClass = (isAlert == false) ? "tag-grid" : "tag-grid threshold";
                    template = template+'<div class="'+wrapperClass+'"><div class="tag-type">'+type+'</div><div class="tag-name">'+tag+'</div><div class="tag-count">'+tagCount+'</div></div>'
                });
                $('#'+category+'-tag-container').html(template);
            });
        }); 
    }
}
function updateData(){
    queryObj.timestamp = lastTimestamp;
    getDataFromServer(queryObj,function(err, data){
        if(err){

        }else{
            if(data != null && data.time > lastTimestamp){
                lastTimestamp = data.time;
                currentData = data.data;
                plotData(data.data);
            }
        }
    });
    if(stopUpdation == false){
        setTimeout(updateData, plotInterval);
    }
}
function fetchRecentData(){
    getDataFromServer(firstQueryObj,function(err, data){
        if(err){

        }else{
            if(data != null){
                lastTimestamp = data.time;
                currentData = data.data;
                plotData(data.data);
                updateData();
            }
        }
    })
}
function init(){
    fetchRecentData();   
}
$(document).ready(function(){
    init();
    $('#clear-logs').on('click',function(){
        $('#info-container').html('');
    })
});