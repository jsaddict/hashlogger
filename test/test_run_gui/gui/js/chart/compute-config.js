function constructCategoryDataConfig(){
    if(!isValidObject(defaultDataConfiguration)){
        defaultDataConfig = {};
    }else{
        defaultDataConfig = defaultDataConfiguration;
    }
    tagDataConfig['err'] = !isValidObject(errDataConfiguration) ? cloneObj(defaultDataConfig) : extendObj(defaultDataConfig,errDataConfiguration);
    tagDataConfig['warn'] = !isValidObject(warnDataConfiguration) ? cloneObj(defaultDataConfig) : extendObj(defaultDataConfig,warnDataConfiguration);
    tagDataConfig['info'] = !isValidObject(infoDataConfiguration) ? cloneObj(defaultDataConfig) : extendObj(defaultDataConfig,infoDataConfiguration);
    console.log('tagDataConfig[err]',tagDataConfig['err'])
} 
function constructErrTypeTagDataConfig(){
    if(!isValidObject(errTypeDataConfiguration)){
        errTypeDataConfiguration = {};
    }
    if(!isValidObject(errTagDataConfiguration)){
        errTagDataConfiguration = {};
    }
    Object.keys(errTypeDataConfiguration).forEach(function(type) {
        if(isValidObject(errTypeDataConfiguration[type])){
            tagDataConfig['err@'+type] = extendObj(tagDataConfig['err'], errTypeDataConfiguration[type]);
        }        
    });
    Object.keys(errTagDataConfiguration).forEach(function(type) {
        Object.keys(errTagDataConfiguration[type]).forEach(function(tag) {
            if(isValidObject(errTagDataConfiguration[type][tag])){
                var parentConfig = isValidObject(tagDataConfig['err@'+type]) ? cloneObj(tagDataConfig['err@'+type]) : cloneObj(tagDataConfig['err']);
                tagDataConfig['err@'+type+'#'+tag] = extendObj(parentConfig,errTagDataConfiguration[type][tag]);
            }           
        });
    });
}
function constructWarnTypeTagDataConfig(){
    if(!isValidObject(warnTypeDataConfiguration)){
        warnTypeDataConfiguration = {};
    }
    if(!isValidObject(warnTagDataConfiguration)){
        warnTagDataConfiguration = {};
    }
    Object.keys(warnTypeDataConfiguration).forEach(function(type) {
        if(isValidObject(warnTypeDataConfiguration[type])){
            tagDataConfig['warn@'+type] = extendObj(tagDataConfig['warn'], warnTypeDataConfiguration[type]);
        }        
    });
    Object.keys(warnTagDataConfiguration).forEach(function(type) {
        Object.keys(warnTagDataConfiguration[type]).forEach(function(tag) {
            if(isValidObject(warnTagDataConfiguration[type][tag])){
                var parentConfig = isValidObject(tagDataConfig['warn@'+type]) ? cloneObj(tagDataConfig['warn@'+type]) : cloneObj(tagDataConfig['warn']);
                tagDataConfig['warn@'+type+'#'+tag] = extendObj(parentConfig,warnTagDataConfiguration[type][tag]);
            }           
        });
    });
}
function constructInfoTypeTagDataConfig(){
    if(!isValidObject(infoTypeDataConfiguration)){
        infoTypeDataConfiguration = {};
    }
    if(!isValidObject(infoTagDataConfiguration)){
        infoTagDataConfiguration = {};
    }
    Object.keys(infoTypeDataConfiguration).forEach(function(type) {
        if(isValidObject(infoTypeDataConfiguration[type])){
            tagDataConfig['info@'+type] = extendObj(tagDataConfig['info'], infoTypeDataConfiguration[type]);
        }        
    });
    Object.keys(infoTagDataConfiguration).forEach(function(type) {
        Object.keys(infoTagDataConfiguration[type]).forEach(function(tag) {
            if(isValidObject(infoTagDataConfiguration[type][tag])){
                var parentConfig = isValidObject(tagDataConfig['info@'+type]) ? cloneObj(tagDataConfig['info@'+type]) : cloneObj(tagDataConfig['info']);
                tagDataConfig['info@'+type+'#'+tag] = extendObj(parentConfig,infoTagDataConfiguration[type][tag]);
            }           
        });
    });
}

// YAxes configuration
function constructCategoryYAxesConfig(){
    if(!isValidObject(plotDefaultOptions.yaxis)){
        defaultYAxesConfig = {};
    }else{
        defaultYAxesConfig = plotDefaultOptions.yaxis;
    }
    tagYAxesConfig['err'] = !isValidObject(errYAxesConfiguration) ? cloneObj(defaultYAxesConfig) : extendObj(defaultYAxesConfig, errYAxesConfiguration);
    tagYAxesConfig['warn'] = !isValidObject(warnYAxesConfiguration) ? cloneObj(defaultYAxesConfig) : extendObj(defaultYAxesConfig, warnYAxesConfiguration);
    tagYAxesConfig['info'] = !isValidObject(infoYAxesConfiguration) ? cloneObj(defaultYAxesConfig) : extendObj(defaultYAxesConfig, infoYAxesConfiguration);
}
function constructErrTypeTagYAxesConfig(){
    if(!isValidObject(errTypeYAxesConfiguration)){
        errTypeYAxesConfiguration = {};
    }
    if(!isValidObject(errTagYAxesConfiguration)){
        errTagYAxesConfiguration = {};
    }
    Object.keys(errTypeYAxesConfiguration).forEach(function(type) {
        if(isValidObject(errTypeYAxesConfiguration[type])){
            tagYAxesConfig['err@'+type] = extendObj(tagYAxesConfig['err'], errTypeYAxesConfiguration[type]);
        }       
    });
    Object.keys(errTagYAxesConfiguration).forEach(function(type) {
        Object.keys(errTagYAxesConfiguration[type]).forEach(function(tag) {
            if(isValidObject(errTagYAxesConfiguration[type][tag])){
                var parentConfig = isValidObject(tagYAxesConfig['err@'+type]) ? cloneObj(tagYAxesConfig['err@'+type]) : cloneObj(tagYAxesConfig['err']);
                tagYAxesConfig['err@'+type+'#'+tag] = extendObj(parentConfig, errTagYAxesConfiguration[type][tag]);
            }            
        });
    });
}
function constructWarnTypeTagYAxesConfig(){
    if(!isValidObject(warnTypeYAxesConfiguration)){
        warnTypeYAxesConfiguration = {};
    }
    if(!isValidObject(warnTagYAxesConfiguration)){
        warnTagYAxesConfiguration = {};
    }
    Object.keys(warnTypeYAxesConfiguration).forEach(function(type) {
        if(isValidObject(warnTypeYAxesConfiguration[type])){
            tagYAxesConfig['warn@'+type] = extendObj(tagYAxesConfig['warn'], warnTypeYAxesConfiguration[type]);
        }       
    });
    Object.keys(warnTagYAxesConfiguration).forEach(function(type) {
        Object.keys(warnTagYAxesConfiguration[type]).forEach(function(tag) {
            if(isValidObject(warnTagYAxesConfiguration[type][tag])){
                var parentConfig = isValidObject(tagYAxesConfig['warn@'+type]) ? cloneObj(tagYAxesConfig['warn@'+type]) : cloneObj(tagYAxesConfig['warn']);
                tagYAxesConfig['warn@'+type+'#'+tag] = extendObj(parentConfig, warnTagYAxesConfiguration[type][tag]);
            }            
        });
    });
}
function constructInfoTypeTagYAxesConfig(){
    if(!isValidObject(infoTypeYAxesConfiguration)){
        infoTypeYAxesConfiguration = {};
    }
    if(!isValidObject(infoTagYAxesConfiguration)){
        infoTagYAxesConfiguration = {};
    }
    Object.keys(infoTypeYAxesConfiguration).forEach(function(type) {
        if(isValidObject(infoTypeYAxesConfiguration[type])){
            tagYAxesConfig['info@'+type] = extendObj(tagYAxesConfig['info'], infoTypeYAxesConfiguration[type]);
        }       
    });
    Object.keys(infoTagYAxesConfiguration).forEach(function(type) {
        Object.keys(infoTagYAxesConfiguration[type]).forEach(function(tag) {
            if(isValidObject(infoTagYAxesConfiguration[type][tag])){
                var parentConfig = isValidObject(tagYAxesConfig['info@'+type]) ? cloneObj(tagYAxesConfig['info@'+type]) : cloneObj(tagYAxesConfig['info']);
                tagYAxesConfig['info@'+type+'#'+tag] = extendObj(parentConfig, infoTagYAxesConfiguration[type][tag]);
            }            
        });
    });
}

// XAxes configuration
function constructCategoryXAxesConfig(){
    if(!isValidObject(plotDefaultOptions.yaxis)){
        defaultXAxesConfig = {};
    }else{
        defaultXAxesConfig = plotDefaultOptions.yaxis;
    }
    tagXAxesConfig['err'] = !isValidObject(errXAxesConfiguration) ? cloneObj(defaultXAxesConfig) : extendObj(defaultXAxesConfig, errXAxesConfiguration);
    tagXAxesConfig['warn'] = !isValidObject(warnXAxesConfiguration) ? cloneObj(defaultXAxesConfig) : extendObj(defaultXAxesConfig, warnXAxesConfiguration);
    tagXAxesConfig['info'] = !isValidObject(infoXAxesConfiguration) ? cloneObj(defaultXAxesConfig) : extendObj(defaultXAxesConfig, infoXAxesConfiguration);
}
function constructErrTypeTagXAxesConfig(){
    if(!isValidObject(errTypeXAxesConfiguration)){
        errTypeXAxesConfiguration = {};
    }
    if(!isValidObject(errTagXAxesConfiguration)){
        errTagXAxesConfiguration = {};
    }
    Object.keys(errTypeXAxesConfiguration).forEach(function(type) {
        if(isValidObject(errTypeXAxesConfiguration[type])){
            tagXAxesConfig['err@'+type] = extendObj(tagXAxesConfig['err'], errTypeXAxesConfiguration[type]);
        }       
    });
    Object.keys(errTagXAxesConfiguration).forEach(function(type) {
        Object.keys(errTagXAxesConfiguration[type]).forEach(function(tag) {
            if(isValidObject(errTagXAxesConfiguration[type][tag])){
                var parentConfig = isValidObject(tagXAxesConfig['err@'+type]) ? cloneObj(tagXAxesConfig['err@'+type]) : cloneObj(tagXAxesConfig['err']);
                tagXAxesConfig['err@'+type+'#'+tag] = extendObj(parentConfig, errTagXAxesConfiguration[type][tag]);
            }            
        });
    });
}
function constructWarnTypeTagXAxesConfig(){
    if(!isValidObject(warnTypeXAxesConfiguration)){
        warnTypeXAxesConfiguration = {};
    }
    if(!isValidObject(warnTagXAxesConfiguration)){
        warnTagXAxesConfiguration = {};
    }
    Object.keys(warnTypeXAxesConfiguration).forEach(function(type) {
        if(isValidObject(warnTypeXAxesConfiguration[type])){
            tagXAxesConfig['warn@'+type] = extendObj(tagXAxesConfig['warn'], warnTypeXAxesConfiguration[type]);
        }       
    });
    Object.keys(warnTagXAxesConfiguration).forEach(function(type) {
        Object.keys(warnTagXAxesConfiguration[type]).forEach(function(tag) {
            if(isValidObject(warnTagXAxesConfiguration[type][tag])){
                var parentConfig = isValidObject(tagXAxesConfig['warn@'+type]) ? cloneObj(tagXAxesConfig['warn@'+type]) : cloneObj(tagXAxesConfig['warn']);
                tagXAxesConfig['warn@'+type+'#'+tag] = extendObj(parentConfig, warnTagXAxesConfiguration[type][tag]);
            }            
        });
    });
}
function constructInfoTypeTagXAxesConfig(){
    if(!isValidObject(infoTypeXAxesConfiguration)){
        infoTypeXAxesConfiguration = {};
    }
    if(!isValidObject(infoTagXAxesConfiguration)){
        infoTagXAxesConfiguration = {};
    }
    Object.keys(infoTypeXAxesConfiguration).forEach(function(type) {
        if(isValidObject(infoTypeXAxesConfiguration[type])){
            tagXAxesConfig['info@'+type] = extendObj(tagXAxesConfig['info'], infoTypeXAxesConfiguration[type]);
        }       
    });
    Object.keys(infoTagXAxesConfiguration).forEach(function(type) {
        Object.keys(infoTagXAxesConfiguration[type]).forEach(function(tag) {
            if(isValidObject(infoTagXAxesConfiguration[type][tag])){
                var parentConfig = isValidObject(tagXAxesConfig['info@'+type]) ? cloneObj(tagXAxesConfig['info@'+type]) : cloneObj(tagXAxesConfig['info']);
                tagXAxesConfig['info@'+type+'#'+tag] = extendObj(parentConfig, infoTagXAxesConfiguration[type][tag]);
            }            
        });
    });
}


function constructTagDataConfig(){
    if(!isValidObject(tagDataConfig)){
        tagDataConfig = {};
    }
    constructCategoryDataConfig();
    constructErrTypeTagDataConfig();
    constructWarnTypeTagDataConfig();
    constructInfoTypeTagDataConfig();
    // console.log('>>>>>',tagDataConfig);
}
function constructTagYAxesConfig(){
    if(!isValidObject(tagYAxesConfig)){
        tagYAxesConfig = {};
    }
    constructCategoryYAxesConfig();
    constructErrTypeTagYAxesConfig();
    constructWarnTypeTagYAxesConfig();
    constructInfoTypeTagYAxesConfig();
    // console.log('>>>>>',tagYAxesConfig);
}
function constructTagXAxesConfig(){
    if(!isValidObject(tagXAxesConfig)){
        tagXAxesConfig = {};
    }
    constructCategoryXAxesConfig();
    constructErrTypeTagXAxesConfig();
    constructWarnTypeTagXAxesConfig();
    constructInfoTypeTagXAxesConfig();
    // console.log('>>>>>',tagXAxesConfig);
}

function initDataStore(){
    var tagArray, len, tagString, tag;
    console.log('allTags---',allTags);
    Object.keys(allTags).forEach(function(category) {
        Object.keys(allTags[category]).forEach(function(type) {
            tagArray = allTags[category][type];
            len = tagArray.length;
            for(var i=0;i<len;i++){
                tag = tagArray[i];
                tagString = category+'@'+type+'#'+tag;
                dataStore[tagString] = [];
            }
        });
    });
}

function constructDataConfig(){
    var tagArray, len, tagString, tag;
    Object.keys(allTags).forEach(function(category) {
        Object.keys(allTags[category]).forEach(function(type) {
            tagArray = allTags[category][type];
            len = tagArray.length;
            for(var i=0;i<len;i++){
                tag = tagArray[i];
                tagString = category+'@'+type+'#'+tag;
                if(typeof tagDataConfig[tagString] == 'undefined'){
                    if(typeof tagDataConfig[category+'@'+type] == 'undefined'){
                        dataConfig[tagString] = cloneObj(tagDataConfig[category]);
                    }else{
                        dataConfig[tagString] = cloneObj(tagDataConfig[category+'@'+type]);
                    }
                }else{
                    dataConfig[tagString] = cloneObj(tagDataConfig[tagString]);
                }
                dataConfig[tagString]['data'] = dataStore[tagString];
                if(isValidObject(alertTags[tagString])){
                    thresholdConfig[tagString] = [];
                    if(typeof alertTags[tagString]['min'] == 'number'){
                        thresholdConfig[tagString].push({
                            below : alertTags[tagString]['min'],
                            color : alertColor
                        })
                    }
                    // Since direct 'above' is not available in threshold plugin, we achieve it using two objects.
                    // 1) below the 'maxInteger' we set error color
                    // 2) below the max threshold value we set normal color. 
                    if(typeof alertTags[tagString]['max'] == 'number'){
                        thresholdConfig[tagString].push({
                            below : maxInteger,
                            color : alertColor
                        })
                        thresholdConfig[tagString].push({
                            below : alertTags[tagString]['max'],
                            color : dataConfig[tagString].color
                        })
                    }
                }else{
                    thresholdConfig[tagString] = null;
                }
                if(typeof dataConfig[tagString].label == 'undefined'){
                    dataConfig[tagString].label = tagString;
                }
            }
        });
    });
}

function constructYAxesConfig(){
    var tagArray, len, tagString, tag;
    Object.keys(allTags).forEach(function(category) {
        Object.keys(allTags[category]).forEach(function(type) {
            tagArray = allTags[category][type];
            len = tagArray.length;
            for(var i=0;i<len;i++){
                tag = tagArray[i];
                tagString = category+'@'+type+'#'+tag;
                if(typeof tagYAxesConfig[tagString] == 'undefined'){
                    if(typeof tagYAxesConfig[category+'@'+type] == 'undefined'){
                        yAxesConfig[tagString] = cloneObj(tagYAxesConfig[category]);
                    }else{
                        yAxesConfig[tagString] = cloneObj(tagYAxesConfig[category+'@'+type]);
                    }
                }else{
                    yAxesConfig[tagString] = cloneObj(tagYAxesConfig[tagString]);
                }
                if(typeof yAxesConfig[tagString] == 'undefined'){
                    yAxesConfig[tagString] = {};
                }
                if(typeof yAxesConfig[tagString].label == 'undefined'){
                    yAxesConfig[tagString].label = tagString;
                }
            }
        });
    });
}
function constructXAxesConfig(){
    var tagArray, len, tagString, tag;
    Object.keys(allTags).forEach(function(category) {
        Object.keys(allTags[category]).forEach(function(type) {
            tagArray = allTags[category][type];
            len = tagArray.length;
            for(var i=0;i<len;i++){
                tag = tagArray[i];
                tagString = category+'@'+type+'#'+tag;
                if(typeof tagXAxesConfig[tagString] == 'undefined'){
                    if(typeof tagXAxesConfig[category+'@'+type] == 'undefined'){
                        xAxesConfig[tagString] = cloneObj(tagXAxesConfig[category]);
                    }else{
                        xAxesConfig[tagString] = cloneObj(tagXAxesConfig[category+'@'+type]);
                    }
                }else{
                    xAxesConfig[tagString] = cloneObj(tagXAxesConfig[tagString]);
                }
                if(typeof xAxesConfig[tagString] == 'undefined'){
                    xAxesConfig[tagString] = {};
                }
                if(typeof xAxesConfig[tagString].label == 'undefined'){
                    xAxesConfig[tagString].label = tagString;
                }
            }
        });
    });
}

function constructPlotOptions(){
    if(typeof plotDefaultOptions != 'object'){
        plotOptions = {}
    }else{
        plotOptions = plotDefaultOptions;
    }
    plotOptions.xaxes = xAxes;
    plotOptions.yaxes = yAxes;
}
function constructAlertTags(){
    if(!isValidObject(alertTags)){
        alertTags = {};
    }
    Object.keys(alertTags).forEach(function(tagString){
        var maxx, minn;
        if(typeof alertTags[tagString] == 'number'){
            alertTags[tagString] = { min : null, max : alertTags[tagString]};
        }
        if(typeof alertTags[tagString] == 'object'){
            maxx = typeof alertTags[tagString]['max'] == 'number' ? alertTags[tagString]['max'] : null;
            minn = typeof alertTags[tagString]['min'] == 'number' ? alertTags[tagString]['min'] : null;
            alertTags[tagString] = { min : minn, max : maxx};
        }
    });
    if(typeof alertColor != 'string'){
        alertColor = '#FF0000';
    }
}


function computeCheckListTagConfig(){
    constructPlotOptions();
    constructAlertTags();

    constructTagDataConfig();
    // console.log('tagDataConfig', tagDataConfig);
    constructTagYAxesConfig();
    // console.log('tagYAxesConfig', yAxesConfig);
    constructTagXAxesConfig();
    // console.log('tagXAxesConfig', xAxesConfig);

    initDataStore(); 
    
    // compute dataConfig and thresholdConfig in constructDataConfig()
    constructDataConfig();
    console.log('dataConfig', dataConfig);
    constructYAxesConfig();
    console.log('yAxesConfig', yAxesConfig);
    constructXAxesConfig();  
    console.log('xAxesConfig', xAxesConfig);      
}
