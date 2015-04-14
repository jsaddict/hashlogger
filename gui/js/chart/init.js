function constructDefaultPlotConfig(){
    computeCheckListTagConfig();
    startLiveDataUpdater();
}
function initCheckList(){
    if(!isValidObject(tagsToBePlotted)){
        tagsToBePlotted = cropObject(allTags, 5);
    }
    // construct a single array of tags to be plotted
    formatTagsToBePlotted();
    generateCheckListTemplate();
    $('#add-to-checklist').on('click',function(){
        addTagToCheckList($("#add-checklist-tag").val());
        console.log($("#add-checklist-tag").val());
    });
    $('.delete-tag').on('click',function(){
        removeCheckListElement($(this))
    })
}
function initTagHandling(){
    console.log('init tag handling');
    initCheckList();
    constructDefaultPlotConfig();    
}
function constructCheckList(initTagHandling){
    if(isValidObject(allTags)){
        return initTagHandling();
    }else{
        $.ajax({
            url: allTagsUrl,
            type: "GET",
            dataType: "json",
            timeout: 5000,
            success: function(response) { 
                allTags = response;
                console.log('allTags assingned ', allTags);
                return initTagHandling();
            },
            error: function(x, t, m) {
                if(t == "timeout") {
                    postInfo('err','timeout receiving all tags response from server. check again');
                } else {
                    postInfo('err','error happend while receiving all tags response from server');
                }
            }
        })
    }  
}
function init(){  
    plotContainer = $(plotContainer);
    updateButton = $(updateButton);
    mask = $(mask);
    
    generateIntervalSelectionTemplate();
    constructCheckList(initTagHandling);
    attachPlotEvents();
    
    $(updateButton).on('click', function(){
        updateButtonHandler();
    });
    $('.plot-type').on('click', function(){
        if($("input:radio[name='plot-data-type']:checked").val() == 'interval'){
            $('#interval-boundary-container').css('display','block');
        }else{
            $('#interval-boundary-container').css('display','none');
        }
    })
    $('#clear-logs').on('click',function(){
        $('#info-container').html('');
    });
    $('.nav-button').on('click',function(){
        if(isUpdating == true){
            return;
        }else{
            navButtonHandler($(this).attr('value'))
        }
    })
}

$(document).ready(function(){
    init();
});