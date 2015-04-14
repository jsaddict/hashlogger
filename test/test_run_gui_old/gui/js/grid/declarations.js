// tags that has to be plotted by default
var tagsToBePlotted,
// setting the threshold values in the chart
	alertTags,
// where we get data for the chart
	dataUrl,
// Interval for regularly checking and fetching data from 'dataUrl'
	plotInterval,
	minInterval = {
	    type : 'seconds',
	    interval : 2
	};
// If 'plotInterval' is less than 'minInterval' , there is a chance of getting duplicated data (of previous timestamp)
// To avoid, we check received data timestamp with old one. If current timestamp is more than 'lastTimeStamp', then we plot.
var lastTimestamp = null;
// query parameters to get data from server
var queryObj = {};
// In cron updation, stop cron of ajax request for live data after 'maxUpdateFailures' successive failures
var maxUpdateFailures = 30;