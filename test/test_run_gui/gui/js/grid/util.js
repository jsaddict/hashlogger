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
}
function cloneObj(obj){
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
        console.log('lastCount;;;',lastCount, typeof lastCount, lastCount == '',typeClass[type],lastClass,typeClass[type] == lastClass,lastMessage)
        
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
