function isValidObject(obj){
    if(typeof obj == 'object' && obj != null){
        return true;
    }else{
        return false;
    }
}
function isValidArray(arr){
    if(typeof arr == 'object' && arr instanceof Array){
        return true;
    }else{
        return false;
    }
}
function isValidNumber(num){
    if(typeof num == 'number' && !isNaN(num)){
        return true;
    }else{
        return false;
    }
}function cloneObj(obj){
    var cloned = extend({}, obj);
    return cloned;
}
function extendObj(target, source){
    var clonedTarget = extend({}, target);
    var extended = extend(clonedTarget, source);
    return extended;
}
function extend(target, source){
    target = target || {};
      for (var prop in source) {
        if (typeof source[prop] === 'object') {
            if(source[prop] instanceof Array){
                target[prop] = source[prop].slice()
            }else{
                target[prop] = extend(target[prop], source[prop]);
            }         
        } else {
          target[prop] = source[prop];
        }
      }
      return target;
}
function cropObject(data,max){
    var croppedObject = {};
    var count = 0;
    Object.keys(data).forEach(function(category) {
        croppedObject[category] = {};
        Object.keys(data[category]).forEach(function(type){
            if(count == max){
                return;
            }
            croppedObject[category][type] = [];           
            tagArray = data[category][type];
            for(var i=0;i<tagArray.length;i++){
                if(count == max){
                    break;
                }
                croppedObject[category][type].push(tagArray[i]);
                count++;               
            }
        });
        count = 0;
    });   
    return croppedObject;
}
function generateIntervalSelectionTemplate(){
    var template = '';
    var isFirstElement = true
    Object.keys(dataIntervals).forEach(function(type){
        var interval = dataIntervals[type];
        for(var i=0;i<interval.length;i++){
            if(isFirstElement){
                template = template+'<div><input type="radio" name="select-data-interval" checked class="select-interval" id="'+type+'-'+interval[i]+'" value="'+interval[i]+'#'+type+'"><label for="'+type+'-'+interval[i]+'">'+interval[i]+' '+type+'</label></div>';
                isFirstElement = false;
            }else{
                template = template+'<div><input type="radio" name="select-data-interval" class="select-interval" id="'+type+'-'+interval[i]+'" value="'+interval[i]+'#'+type+'"><label for="'+type+'-'+interval[i]+'">'+interval[i]+' '+type+'</label></div>';
            }            
        }
    });
    $('#interval-select-container').html(template);  
}
function generateCheckListTemplate(){
    var temp = '';
    var tagString = null;
    var tagDetails = null;
    var tagArray = [];
    var category;
    for(var i=0;i<tagCategories.length;i++){
        category = tagCategories[i];
        temp = '<div class="tag-category" id="'+category+'-category">';
        Object.keys(allTags[category]).forEach(function(type){
            temp = temp + '<div class="type-category" id="'+category+'-'+type+'">';
            tagArray = allTags[category][type];
            for(var i=0;i<tagArray.length;i++){
                tagString = category+'@'+type+'#'+tagArray[i];
                temp = temp + '<div class="tag-wrapper" category="'+category+'">';
                if(tagsToBePlotted.indexOf(tagString) == -1){
                    temp = temp + '<input type="checkbox" value="'+tagString+'" id="'+tagString+'" class="checklist-element"><label for="'+tagString+'">'+tagString+'</label>';
                }else{
                    temp = temp + '<input type="checkbox" checked value="'+tagString+'" id="'+tagString+'" class="checklist-element"><label for="'+tagString+'">'+tagString+'</label>';
                }
                temp = temp + '</div>';
            }
            temp = temp +'</div>';
        });
        temp = temp+'</div>';
        $('#'+category+'-category-wrapper').html(temp);
        temp = '';
    }  
}
function formatTagsToBePlotted(){
    var temp = [];
    var tagArray, len, tagString, tag;
    Object.keys(tagsToBePlotted).forEach(function(category) {
        Object.keys(tagsToBePlotted[category]).forEach(function(type) {
            tagArray = tagsToBePlotted[category][type];
            len = tagArray.length;
            for(var i=0;i<len;i++){
                tag = tagArray[i];
                tagString = category+'@'+type+'#'+tag;
                temp.push(tagString);
            }
        });
    });
    tagsToBePlotted = temp;
}
function postInfo(type,message, obj){
    var parentElement = '#info-container';
    var lastElement = '#info-container div:last-child'
    var typeClass = {
        'err' : 'app-err',
        'warn' : 'app-warn',
        'info' : 'app-info'
    };
    var lastMessage = null, 
        lastCount = null, 
        lastClass = null, 
        isSameMessage = false,
        nextCount = 0;
    if($(lastElement).length == 1){
        lastMessage = $(lastElement).find('.log-message').text();
        lastCount = $(lastElement).find('.log-count').text();
        lastClass = $(lastElement).attr('class');      
    }
    if(message == lastMessage && typeClass[type] == lastClass){
        isSameMessage = true;
    }
    if(isSameMessage == false){
        var temp = '<div class="'+typeClass[type]+'"><span class="log-count"></span><p class="log-message">'+message+'</p><span class="delete-info"></div>';
        $(parentElement).append(temp);
        return;
    }else{
        if(lastCount == ''){
            nextCount = 2;
        }else{
            console.log('lastCount  ',lastCount)
            nextCount = parseInt(lastCount);  
            nextCount++;         
        }
        $(lastElement).find('.log-count').text(nextCount);
    }   
    
}
function setUpdating(value){
    console.log('set updating ', value)
    if(value == false){
        isUpdating = false;
        $(mask).css('display','none');
        $(plotContainer).removeClass('no-event');
        $(updateButton).removeClass('no-event');
        $('.nav-button').removeClass('no-event');
    }else{
        isUpdating = true;
        $(mask).css('display','block');
        $(plotContainer).addClass('no-event');
        $(updateButton).addClass('no-event'); 
        $('.nav-button').addClass('no-event');      
    }
}
