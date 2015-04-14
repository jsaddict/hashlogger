/*
var dbFormat = {
	err : {
		type1e : {
			'no-tag' : 20,
			'tag1ew' : 114,
			// 'tag-total' is calculated dynamically and is total of all tags in type.
			'tag-total' : 134
		}
	},
    time : 2131143
}

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

var tagsToBePlotted = ['err@type1e#no-tag' ,'info@type2i#tag-total'];

// store data about allTags
var dataStore = {
    'err@type1e#no-tag' : [],
    'info@type2i#tag-total' : []
};

var tagDataConfig = 
    tagYAxesConfig = 
    tagXAxesConfig = {
    'err' : {},
    'err@type1e' : {},
    'err@type1e#no-tag' : {},
    'info@type2i#tag-total' : {},
    'alert' : {}
};

// allTags are included. easy to access and fast
var yAxesConfig = 
    xAxesConfig = {
    'err@type1e#no-tag' : {},
    'info@type2i#tag-total' : {}
};

// allTags and reference to data.
var dataConfig = {
    'err@type1e#no-tag' : {
        data : dataStore['err@type1e#no-tag']
    },
    'info@type2i#tag-total' : {
        data : dataStore['info@type2i#tag-total']
    }
};


var plotOptions = {
    xaxes : xAxes,
    yaxes : yAxes
}

var liveDataConfig = {
    url : 'http://localhost:8000/data',
    interval : 2000
}


// adding tags select tag template
<optgroup label="Errw">
    <option value="errw@type">type</option>
    <option value="errw@type#key">type#key</option>
</optgroup>

*/