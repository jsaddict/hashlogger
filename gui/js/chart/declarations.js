// computed configuration of tags that are declared
var tagDataConfig = {};
var tagYAxesConfig = {};
var tagXAxesConfig = {};

// It is calculated config for allTags
// i.e. data : dataStore[Atag]; We can directly push this to plotData based on plotSeries.
// computed axes configuration for allTags for easy and fast access.
var dataConfig = {};
var yAxesConfig = {};
var xAxesConfig = {};
var thresholdConfig = {};

var tagCategories = ['err','warn','info'];

var allTags = {
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
};

var allTags = null;
var alertTags = {
    'err@type0#tag-total' : { max : 15, min : 10},
    'warn@type4#tag-total' : { min : 2},
    'info@type3#tag-total' : { min : 2}
}
alertTags = null;
// DOM element in which, the graph is plotted.
var plotContainer = '#graph-container';
var updateButton = '#update-plot';
var mask = '#plot-processing';
// Maximum number of Y axis to be displayed
var maxYAxes = 10;
// After user stopped zoom or pan, it wait for this delay. If no event happens, then updates.
// for Zooming and Panning events on plot, after this delay only we update the plot
// If no delay, simultaneous successive events may hang the updation.
var plotEventDelay = 1700;

// Maximum length of plotData array.
var plotDataLength = 15;
// Queue of times that recieved from server. 
// We can check boundaries of the data. If zoom in boundaries are within live plot boundaries no need to bring and redraw data.
var timeQ = [];
// store live data for allTags. We initialize with empty array for all tags
// We have already given this reference as data to series configuration
var dataStore = {
    'err@type1e#no-tag' : [],
    'info@type2i#tag-total' : []
};
var allTagsUrl, dataUrl;


// When user is zoomed or dragged the plot, it is set false.
var isLiveData = true;
// When user add or remove tags and click update, before graph is plotted, it is updating.
// It it is updating, clicking update won't work.
var isUpdating = false;


// Tags that has to be plotted in next plot.
// Series of tagStrings (Atags) in order in which the plotData order is 
// tagsToBePlotted defines the order in which the tags are plotted.
// Every plot opration is handled w.r.t tagsToBePlotted. On every delete or add of tag, update tag series and 
// based on that change the tagsToBePlotted and plotConfig.
var tagsToBePlotted =  null;
// Interval for regularly checking and fetching data from 'dataUrl'
var plotInterval = 1000;

// Final data to be plotted i.e constructed dynamically on plotSeries
// plotData = [{},{}];
var plotData = [];
var plotOptions = {};
// Used to set plotOptions.
//  plotOptions.xaxes = xAxes;
//  plotOptions.yaxes = yAxes;
//  So on updating yAxes and xAxes according to plotSeries, plot will automatically update
var yAxes = [];
var xAxes = [];
// plot object reurned when when we plot data
var plotObject = {};

// Users can select the type dynamically
var currentInterval = {
    type : 'seconds',
    interval : 2
}
// minInterval is to disable threshold in plot other than default minInterval
var minInterval = {
    type : 'seconds',
    interval : 2
}
// Always minInterval type array elements should be divisible by first element
// and minInterval should be a factor for 60 (if type is seconds, minutes) for 24 (if type is hours)
var dataIntervals = {
    seconds : [2, 10, 30],
    minutes : [1, 15, 30],
    hours : [1, 6, 12],
    days : [1, 7],
    months : [1, 3, 4],
    years : [1]
}

// When displaying 'plotDataLength' number of data points, some may have no data at specific interval.
// It causes plot uneven 
// Example : 
//  1)'plotDataLength' number of data points of A's time are : [3, 4, 5, 6]
//  2)'plotDataLength' number of data points of B's time are : [1, 4, 5, 6]
//  3)'plotDataLength' number of data points of C's time are : [2, 3, 4, 6]
//  If we plot above data, A will not have data point at interval 1 and 2
//                         B will not have data point at interval 2 
// the graph look incomplete and may be wider than normal
var minXAxis = 0;

// Used for setting above threshold in flot chart
var maxInteger = 9007199254740992;
// In cron updation, stop cron of ajax request for live data after 'maxUpdateFailures' successive failures
var maxUpdateFailures = 30;

/*
We have to give moment("value in milliseconds (not in timestamp)")
months range from 0-11 not 1-12 so, we have to decrement month, while calculating time.
*/