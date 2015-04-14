function constructTagsToBePlotted(){
    tagsToBePlotted = [];
    $( ".checklist-element:checked" ).each(function() {
        tagsToBePlotted.push($( this ).attr( "value" ));
    });
}
function constructPlotData(){
    var setThreshold = false;
    if(currentInterval.type == minInterval.type && currentInterval.interval == minInterval.interval){
        setThreshold = true;
    }
    var len = tagsToBePlotted.length;
    var tag;
    plotData = [];
    for(var i=0; i<len; i++){
        tag = tagsToBePlotted[i];
        if(setThreshold == true){
            if(thresholdConfig[tag] != null){
                dataConfig[tag].threshold = thresholdConfig[tag];
            }
        }else{
            dataConfig[tag].threshold = undefined;
        }
        dataConfig[tag].data = dataStore[tag];
        plotData.push(dataConfig[tag]);
        if(isValidArray(dataStore[tag]) && isValidArray(dataStore[tag][0])){    
            if(minXAxis < dataStore[tag][0][0]){
                minXAxis = dataStore[tag][0][0];
            }
        }else{
            minXAxis = null;
        }
    }
}
function constructYAxes(){
    var len = tagsToBePlotted.length;
    yAxes = [];
    for(var i=0; i<len; i++){
        yAxes.push(yAxesConfig[tagsToBePlotted[i]]);
    }
}
function constructXAxes(){
    var len = tagsToBePlotted.length;
    xAxes = [];
    for(var i=0; i<len; i++){
        if(isLiveData){
            xAxesConfig[tagsToBePlotted[i]].min = minXAxis;
        }else{
            xAxesConfig[tagsToBePlotted[i]].min = undefined;
        }
        xAxes.push(cloneObj(xAxesConfig[tagsToBePlotted[i]]));
    }
}
function initPlotConfig(resetData, dataArray){
    constructTagsToBePlotted();

    updatePlotData(resetData, dataArray);

    constructPlotData();
    constructYAxes();
    constructXAxes();
}


function plotNow(resetData, dataArray){
    initPlotConfig(resetData, dataArray);
    plotOptions.xaxes = xAxes;
    plotOptions.yaxes = yAxes;
    plotObject = $.plot(plotContainer, plotData, plotOptions);
    setUpdating(false);
}



// Start Plot Event Handling
var lastEventTimeout;
function triggerPlotEvent(boundary){
    clearTimeout(lastEventTimeout);
    lastEventTimeout = setTimeout((function(limits){
        return function(){
            if(limits.from < timeQ[0] || limits.to > timeQ[timeQ.length-1]){
                limits.format = 'interval';
                updatePlot(limits);
            }else{
                setUpdating(false);
            }           
        }
    }(boundary)),plotEventDelay);
}
function handlePlotEvents(plotObj){
    var obj = {};
    obj.from = parseInt(plotObj.getAxes().xaxis.options.min/1000);
    obj.to = parseInt(plotObj.getAxes().xaxis.options.max/1000);
    console.log('handlePlotEvents from to',obj.from, obj.to);
    isLiveData = false;
    triggerPlotEvent(obj);
}
function attachPlotEvents(){
    plotContainer.on("plotpan", function (event, plot) {
        if(isUpdating == false){
            handlePlotEvents(plot);
        }        
    });

    plotContainer.on("plotzoom", function (event, plot) {
        if(isUpdating == false){
            isLiveData = false;
        }
    });

    plotContainer.on("plothover", function (event, pos, item) {
        if(isUpdating == true){
            return;
        }
        if (item) {
            var x = item.datapoint[0].toFixed(2),
                y = item.datapoint[1].toFixed(2);
            var label = item.series.label;
            if(label == null){
                if(isValidObject(item.series.originSeries)){
                    label = item.series.originSeries.label;
                }
            }
            $("#tooltip").html(label + " = " + y)
                .css({top: item.pageY+5, left: item.pageX+5})
                .fadeIn(200);
        } else {
            $("#tooltip").hide();
        }
    });
}


function getIntervals(){
    var property, value;
    var returnObj = {};
    var fromObj = {};
    var toObj = {};
    var properties = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
    for(var i=0; i< properties.length; i++){
        property = properties[i];
        value = parseInt($('#from-'+property).val());
        if(isValidNumber(value)){
            if(property == 'days'){
                property = 'date';
            }
            fromObj[property] = value;
        }       
    }
    console.log('fromObj',fromObj)
    if(moment(fromObj).isValid()){
        // months range from 0-11 not 1-12 so, we have to decrement month, while calculating time.
        if(typeof fromObj.months == 'number'){
            fromObj.months--;
        }
        returnObj.from = parseInt(moment.utc(fromObj).valueOf()/1000);
    }else{
        postInfo('err','From date is not valid'); 
    }

    for(var i=0; i< properties.length; i++){
        property = properties[i];
        value = parseInt($('#to-'+property).val());
        if(isValidNumber(value)){
            if(property == 'days'){
                property = 'date';
            }
            toObj[property] = value;
        }       
    }
    console.log('toObj',toObj)
    if(moment(toObj).isValid()){
        // months range from 0-11 not 1-12 so, we have to decrement month, while calculating time.
        if(typeof toObj.months == 'number'){
            toObj.months--;
        }
        returnObj.to = parseInt(moment.utc(toObj).valueOf()/1000);
    }else{
        postInfo('err','To date is not valid'); 
    }
    return returnObj;
}
function navButtonHandler(direction){
    var selectedInterval = ($("input:radio[name='select-data-interval']:checked").val()).split('#');
    currentInterval.interval = parseInt(selectedInterval[0]);
    currentInterval.type = selectedInterval[1];
    if(direction == 'previous'){
        var obj = {};
        obj.to = parseInt(plotObject.getAxes().xaxis.min/1000);
        intervalType = currentInterval.type;
        if(intervalType == 'days'){
            intervalType = 'date';
        }
        obj.from = parseInt((moment(obj.to*1000).subtract(plotDataLength*(currentInterval.interval), intervalType).valueOf())/1000);
        
        obj.format = 'interval';
        isLiveData = false;
        console.log('previous request obj  ',obj,obj.to-obj.from);
        updatePlot(obj)
    }else{
        var obj = {};
        obj.from = parseInt(plotObject.getAxes().xaxis.max/1000);
        intervalType = currentInterval.type;
        if(intervalType == 'days'){
            intervalType = 'date';
        }
        obj.to = parseInt((moment(obj.from*1000).add(plotDataLength*(currentInterval.interval), intervalType).valueOf())/1000);
        obj.format = 'interval';
        isLiveData = false;
        console.log('next request obj  ',obj,obj.to-obj.from);
        updatePlot(obj)
    }
}
function updateButtonHandler(){
    var intervalType;
    if(isUpdating == true){
        return;
    } 
    var selectedFormat = $("input:radio[name='plot-data-type']:checked").val();
    var selectedInterval = ($("input:radio[name='select-data-interval']:checked").val()).split('#');
    currentInterval.interval = parseInt(selectedInterval[0]);
    currentInterval.type = selectedInterval[1];
    if(selectedFormat == 'live'){
        isLiveData = true;
        updatePlot({format : 'live'})
    }else
    if(selectedFormat == 'interval'){
        var obj = getIntervals();
        obj.format = 'interval';
        isLiveData = false;
        updatePlot(obj);
    }
}
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
// End update button Handling


// It is called in 3 instances
// 1. On clicking update button 
// 2. On plot event plotpan 
// 3. On clicking previous and next buttons 
//  On update plot, we stop the live updater.
//  If updatePlot is called becuase of clicking update button and live is selected, then we start live updater after plotting.

// data updating on plot events --> updatePlot({format : 'interval', from : timestamp, to : timestamp})
// updating on 'update' or 'previous' or 'next' button 
//              if 'live' selected --> updatePlot({format : 'live'}) --> plot with last N data --> start updater --> updater updates in {format : 'timestamp'}
//              other than 'live'  --> updatePlot({format : 'interval', from : timestamp, to : timestamp})

// On updating, we disable plot events (by pointer-events: none) and disable update button
function updatePlot(info){
    if(isUpdating == true){
        return;
    }   
    setUpdating(true);
    if(info.format == 'interval'){
        fetchIntervalData(info.from, info.to, function(err, data){
            if(!err){
                if(data == null){
                    setUpdating(false);
                }else{
                    plotNow(true, data);
                }
            }
        })
    }else{
        startLiveDataUpdater();
    } 
}