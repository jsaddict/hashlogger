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
            if(data instanceof Array){
                if(data.length == 0){
                    if(obj.format == 'interval'){
                        postInfo('info','No data received : Received empty array');
                        alert('No data received');
                        return fn(null, null)
                    }                   
                }
                return fn(null, data);
            }else{
                if(data == null){
                    if(obj.format == 'interval'){
                        postInfo('info','No data received : Received null');
                        alert('No data received');
                    }
                    return fn(null, null);
                }else{
                    return fn(null, [data]);
                }                    
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

// gets interval of data objects from to timestamps
function fetchIntervalData(from, to, fn){
    var obj = cloneObj(currentInterval);
    obj.format = 'interval';
    obj.from = from;
    obj.to = to;
    getDataFromServer(obj, function(err, data){
        if(err){
            return fn(null, null);
        }else{
            return fn(null, data);
        }
    })
}
// gets last inserted N (plotDataLength) of data objects
function fetchRecentData(fn){
    var obj = cloneObj(currentInterval);
    obj.format = 'recent';
    obj.count = plotDataLength;
    getDataFromServer(obj, function(err, data){
        if(err){
            return fn(null, null);
        }else{
            return fn(null, data);
        }
    })
}
// Gets data objects that are greater than the timestamp (Most cases it is 1. used for live updating cron)
// If timestamp is 0, then send last inserted data.
function fetchCurrentData(fn){
    var obj = cloneObj(currentInterval);
    var timestamp;
    obj.format = 'timestamp';
    if(timeQ.length ==0){
        timestamp = 0;
    }else{
        timestamp = timeQ[timeQ.length - 1];
    }
    obj.timestamp = timestamp;
    getDataFromServer(obj, function(err, data){
        if(err){
            return fn(null, null);
        }else{
            return fn(null, data);
        }
    })
}
function pushDataItem(data){
    var time = data.time;
    timeQ.push(time);
    data = cloneObj(data.data);
    if(timeQ.length > plotDataLength){
        timeQ.shift();
    }
    Object.keys(data).forEach(function(category) {
        Object.keys(data[category]).forEach(function(type){
            Object.keys(data[category][type]).forEach(function(tag){
                tagString = category+'@'+type+'#'+tag;
                if(typeof dataStore[tagString] == 'undefined'){
                    dataStore[tagString] = [];
                }
                if(typeof parseInt(data[category][type][tag]) == 'number'){
                    dataStore[tagString].push([time*1000, parseInt(data[category][type][tag])]);
                }else{
                    dataStore[tagString].push([time*1000, 0]);
                }
                if(dataStore[tagString].length > plotDataLength){
                    dataStore[tagString].shift();
                }
            });
        });
    }); 
}
function resetPlotData(){
    var len = tagsToBePlotted.length
    for(var i=0;i<len;i++){
        dataStore[tagsToBePlotted[i]] = [];
    } 
    timeQ = [];
}
function updatePlotData(reset, dataArray){
    if(dataArray instanceof Array){
        dataArray = dataArray.slice(plotDataLength*(-1)).concat();
        var len = dataArray.length;
        if(reset){
            resetPlotData();  
        }   	  
        for(var i=0;i<len;i++){
            pushDataItem(dataArray[i]);
        }
    }else{
        postInfo('err','custom data is not in array format'); 
    }
}