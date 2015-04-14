dataUrl = 'http://localhost:8000/plot-data';
plotInterval = 1000;
// alertTags = {
//     'err@type0#tag-total' : { max : 15, min : 10},
//     'err@type4#tag-total' : { max : 12, min : 7},
//     'warn@type4#tag-total' : { min : 2},
//     'info@type3#tag-total' : { min : 2}
// }
alertTags = {
    'err@type0#tag-total' : { max : 5, min : 2},
    'err@type1#tag-total' : { max : 5, min : 2},
    'err@type2#tag-total' : { max : 5, min : 2},
    'err@type3#tag-total' : { max : 5, min : 2},
    'err@type4#tag-total' : { max : 5, min : 2},
    'warn@type4#tag-total' : { min : 2},
    'info@type3#tag-total' : { min : 2}
}
minInterval = {
    type : 'seconds',
    interval : 2
}
maxUpdateFailures = 5;
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