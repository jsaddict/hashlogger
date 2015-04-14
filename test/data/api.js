var utils = require('../../module/app-util.js')({handleError : "throw-error"});
var getError = utils.getError;
var cloneObj = utils.cloneObj;
var appUtil = {
	getError : getError,
	cloneObj : cloneObj
};
var config = {
	defaultConfig : {
		err : {
	        track : true,
	        defaultTagType : 'globalError',
	        defaultMessage : 'Error!!',
	        msgSeparator : ' -> '
	    },
	    info : {
	        track : true,
        	defaultTagType : 'globalInfo',
	        defaultMessage : 'Info'
	    },
	    warn : {
	        track : true,
        	defaultTagType : 'globalWarn',
	        defaultMessage : 'Warn'
	    }
	},
	customConfig : {
		err : {
	        track : true,
	        defaultTagType : 'globalErrorr',
	        defaultMessage : 'Error occuredd',
	        msgSeparator : ' ->> '
	    },
	    info : {
	        track : true,
        	defaultTagType : 'globalInfoo',
	        defaultMessage : 'Infoo'
	    },
	    warn : {
	        track : true,
        	defaultTagType : 'globalWarnn',
	        defaultMessage : 'Warnn'
	    }
	},
	noTrackConfig : {
		err : {
	        track : false,
	        defaultTagType : 'globalErrorr',
	        defaultMessage : 'Error occuredd',
	        msgSeparator : ' ->> '
	    },
	    info : {
	        track : false,
        	defaultTagType : 'globalInfoo',
	        defaultMessage : 'Infoo'
	    },
	    warn : {
	        track : false,
        	defaultTagType : 'globalWarnn',
	        defaultMessage : 'Warnn'
	    }
	}
};
var msgs = [
	{
		param : ['hello'],
		msg : 'hello'
	},
	{
		param : ['hello from foo [%d]', 123],
		msg : 'hello from foo [123]'
	},
	{
		param : ['%s:%s', 'foo'],
		msg : 'foo:%s'
	},
	{
		param : ['%s:%s', 'foo', 'bar', 'baz'],
		msg : 'foo:bar baz'
	},
	{
		param : [1, 2, 3],
		msg : '1 2 3'
	}
];
var tags = [
	{
		tag : ['type1'],
		obj : { 'type1' : { 'no-tag' : 1}},
		errName : 'type1',
		errTag : 'type1@no-tag'
	},
	{
		tag : ['type1@tag1'],
		obj : { 'type1' : { 'tag1' : 1}},
		errName : 'type1',
		errTag : 'type1@tag1'
	},
	{
		tag : ['type1@tag1#tag2'],
		obj : { 'type1' : { 'tag1' : 1, 'tag2' : 1}},
		errName : 'type1',
		errTag : 'type1@tag1#tag2'
	},
	{
		tag : ['type-1@tag-1#tag-2#tag-3'],
		obj : { 'type-1' : { 'tag-1' : 1, 'tag-2' : 1, 'tag-3' : 1}},
		errName : 'type-1',
		errTag : 'type-1@tag-1#tag-2#tag-3'
	},
	{
		tag : ['type2@tag1#tag1'],
		obj : { 'type2' : { 'tag1' : 2}},
		errName : 'type2',
		errTag : 'type2@tag1#tag1'
	},
	{
		tag : ['type2@tag1#tag2#tag2'],
		obj : { 'type2' : { 'tag1' : 1, 'tag2' : 2}},
		errName : 'type2',
		errTag : 'type2@tag1#tag2#tag2'
	}
];
var tagCount = {
	'type1' : {
		'no-tag' : 1,
		'tag1' : 2,
		'tag2' : 1
	},
	'type-1' : {
		'tag-1' : 1,
		'tag-2' : 1,
		'tag-3' : 1
	},
	'type2' : {
		'tag1' : 3, 
		'tag2' : 2
	}
};
function getErrorObj(type){
	var errObj;
	switch(type) {
	    case 'err1':
	        return new Error();
	    case 'err2':
	    	errObj = new Error('err2');
	    	errObj.name = 'type2';
	        return errObj;
	    case 'err3':
	        errObj = new Error('err3');
	    	errObj.name = 'type3';
	        return errObj;
	    case 'err4':
	        errObj = new Error();
	    	errObj.name = 'type4';
	        return errObj;
	    case 'err5':
	        errObj = new Error('err5');
	        return errObj;
	    default:
	    	return new Error();
	}
}
var errArgs = [
	{ 
		errObj : 'err1',
		err : [[]],
		msg : null,
		result : {			
			defaultConfigMsg :'',
			customConfigMsg: '',
			currentMsg :'',
			countObj :null
		}
	},
	{ 
		errObj : 'err1', 
		err : [['errType1']],
		msg : null,
		result : {			
			defaultConfigMsg :'',
			customConfigMsg: '',
			currentMsg :'',
			countObj :{
				'errType1' : {
					'no-tag' : 1
				}
			}
		}
	},
	{ 
		errObj : 'err2', 
		err : [[]],
		msg : null,
		result : {			
			defaultConfigMsg :'err2',
			customConfigMsg: 'err2',
			currentMsg :'',
			countObj :null
		}
	},
	{ 
		errObj : 'err2', 
		err : [['errType1']],
		msg : null,
		result : {			
			defaultConfigMsg :'err2',
			customConfigMsg: 'err2',
			currentMsg :'',
			countObj :{
				'errType1' : {
					'no-tag' : 1
				}
			}
		}
	},
	{ 
		errObj : 'err1', 
		err : [[]],
		msg : [['hello']],
		result : {			
			defaultConfigMsg :'hello',
			customConfigMsg: 'hello',
			currentMsg :'hello',
			countObj :null
		}
	},
	{ 
		errObj : 'err1', 
		err : [['errType1']],
		msg : [['hello from foo [%d]', 123]],
		result : {			
			defaultConfigMsg :'hello from foo [123]',
			customConfigMsg: 'hello from foo [123]',
			currentMsg :'hello from foo [123]',
			countObj :{
				'errType1' : {
					'no-tag' : 1
				}
			}
		}
	},
	{ 
		errObj : 'err2',
		err : [[]],
		msg : [['%s:%s', 'foo', 'bar', 'baz']],
		result : {			
			defaultConfigMsg :'foo:bar baz -> err2',
			customConfigMsg: 'foo:bar baz ->> err2',
			currentMsg :'foo:bar baz',
			countObj :null
		}
	},
	{ 
		errObj : 'err2', 
		err : [['errType1']],
		msg : [['hello from foo [%d]', 123]],
		result : {			
			defaultConfigMsg :'hello from foo [123] -> err2',
			customConfigMsg: 'hello from foo [123] ->> err2',
			currentMsg :'hello from foo [123]',
			countObj :{
				'errType1' : {
					'no-tag' : 1
				}
			}
		}
	},
	{ 
		errObj : 'err2', 
		err : [['errType1@errTag1#errTag2'],['errType2@errTag1#errTag2']],
		msg : [['hello from foo [%d]', 123],['hello']],
		result : {			
			defaultConfigMsg :'hello -> hello from foo [123] -> err2',
			customConfigMsg: 'hello ->> hello from foo [123] ->> err2',
			currentMsg :'hello',
			countObj :{
				'errType1' : {
					'errTag1' : 1,
					'errTag2' : 1
				},
				'errType2' : {
					'errTag1' : 1,
					'errTag2' : 1
				}
			}
		}
	},
	{ 
		errObj : 'err3',  
		err : [['errType1@errTag1#errTag2'],['errType2@errTag1#errTag2'],['errType3@errTag1#errTag2']],
		msg : [['hello from foo [%d]', 123],['hello'],['hello from foo [%s]', 'hello']],
		result : {			
			defaultConfigMsg :'hello from foo [hello] -> hello -> hello from foo [123] -> err3',
			customConfigMsg: 'hello from foo [hello] ->> hello ->> hello from foo [123] ->> err3',
			currentMsg :'hello from foo [hello]',
			countObj :{
				'errType1' : {
					'errTag1' : 1,
					'errTag2' : 1
				},
				'errType2' : {
					'errTag1' : 1,
					'errTag2' : 1
				},
				'errType3' : {
					'errTag1' : 1,
					'errTag2' : 1
				}
			}
		}
	},
	{ 
		errObj : 'err2',  
		err : [['errType1@errTag1#errTag2'],['errType2@errTag1#errTag2'],['errType2@errTag1#errTag2']],
		msg : [['hello'],['hello from foo [%d]', 123],['hello from foo [%s]', 'hello']],
		result : {			
			defaultConfigMsg :'hello from foo [hello] -> hello from foo [123] -> hello -> err2',
			customConfigMsg: 'hello from foo [hello] ->> hello from foo [123] ->> hello ->> err2',
			currentMsg :'hello from foo [hello]',
			countObj :{
				'errType1' : {
					'errTag1' : 1,
					'errTag2' : 1
				},
				'errType2' : {
					'errTag1' : 2,
					'errTag2' : 2
				}
			}
		}
	},
	{ 
		errObj : 'err5', 
		err : [['errType1@errTag1#errTag2'],['errType2@errTag1#errTag2'],['errType1@errTag1#errTag3']],
		msg : [['hello from foo [%d]', 123],['hello from foo [%s]', 'hello'],['hello']],
		result : {			
			defaultConfigMsg :'hello -> hello from foo [hello] -> hello from foo [123] -> err5',
			customConfigMsg: 'hello ->> hello from foo [hello] ->> hello from foo [123] ->> err5',
			currentMsg :'hello',
			countObj :{
				'errType1' : {
					'errTag1' : 2,
					'errTag2' : 1,
					'errTag3' : 1
				},
				'errType2' : {
					'errTag1' : 1,
					'errTag2' : 1
				}
			}
		}
	}
];
module.exports = function(){
	return {		
		appUtil : appUtil,
		config : config,
		msgs : msgs,
		tags : tags,
		tagCount : tagCount,
		getErrorObj : getErrorObj,
		errArgs : errArgs
	}
}