/*
allTagsUrl = 'http://localhost:8000/get-tags';
dataUrl = 'http://localhost:8000/plot-data';
plotInterval = 2000;
plotEventDelay = 700;
tagsToBePlotted = {
    err : {
        type1e : ['tag0e','tag-total'],
        type2e : ['tag-total']
    },
    warn : {
        type2w : ['tag40w']
    },
    info : {
        type1i : ['tag-total'],
        type2i : ['tag10i']
    }
};
tagsToBePlotted = null;
alertTags = {
    'err@type0#tag-total' : { max : 15, min : 10},
    'warn@type4#tag-total' : { min : 2},
    'info@type3#tag-total' : { min : 2}
}
*/
plotEventDelay = 700;
allTags = {
    err : {
        type1e : ['no-tag','tag0e','tag5ew','tag-total'],
        type2e : ['tag1e','tag7e','tag-total']
    },
    warn : {
        type1w : ['no-tag','tag8w','tag2ew','tag-total'],
        type2w : ['tag1w','tag40w','tag-total']
    },
    info : {
        type1i : ['no-tag','tag11i','tag21i','tag-total'],
        type2i : ['tag10i','tag4ew','tag-total']
    }
}
allTags = null;
tagsToBePlotted = {
    err : {
        type1e : ['tag0e','tag-total'],
        type2e : ['tag-total']
    },
    warn : {
        type2w : ['tag40w']
    },
    info : {
        type1i : ['tag-total'],
        type2i : ['tag10i']
    }
};
tagsToBePlotted = null;
allTagsUrl = 'http://localhost:8000/get-tags';
