var defaultErrConfig = require('../../module/default-config.js').err;
var objData = [
	{
		target : null,
		source : null,
		result : {}
	},
	{
		target : {
		},
		source : {
			two : 'two',
		},
		result : {
			two : 'two'
		}
	},
	{
		target : {
			one : 'one',
		},
		source : {
		},
		result : {
			one : 'one'
		}
	},
	{
		target : {
			one : 'one',
		},
		source : {
			two : 'two',
		},
		result : {
			one : 'one',
			two : 'two'
		}
	},
	{
		target : {
			one : 'one',
		},
		source : {
			one : 'two',
			two : 'two'
		},
		result : {
			one : 'two',
			two : 'two'
		}
	},
	{
		target : {
			one : 'one',
		},
		source : {
			two : 'two',
			three : [1,2,3]
		},
		result : {
			one : 'one',
			two : 'two',
			three : [1,2,3]
		}
	},
	{
		target : {
			one : 'one',
			three : ['string'],
			arr1 : 'hi',
			arr3 : []
		},
		source : {
			two : 'two',
			three : [1,2,3],
			four : {
				five : 'five',
				six : [1,2,3]
			},
			arr1 : [],
			arr2 : [],
			arr3 : 'hi3'

		},
		result : {
			one : 'one',
			two : 'two',
			three : [1,2,3],
			four : {
				five : 'five',
				six : [1,2,3]
			},
			arr1 : [],
			arr2 : [],
			arr3 : 'hi3'
		}
	},
	{
		target : {
			one : 'one',
			three : {},
			nine : 'nine',
			four : {
				five : 'six',
				seven : 7
			}
		},
		source : {
			two : 'two',
			three : [1,2,3],
			four : {
				five : 'five',
				six : [1,2,3]
			}
		},
		result : {
			one : 'one',
			two : 'two',
			three : [1,2,3],
			nine : 'nine',
			four : {
				five : 'five',
				six : [1,2,3],
				seven : 7
			}
		}
	},
	{
		target : {
			one : 'one',
			three : {},
			nine : 'nine',
			four : {
				five : 'six',
				seven : 7,
				ten : {
					nine : 9,
					arr : [1,2]
				},
				last : {
					hello : 'world'
				}
			},
			hello : 'world',
			helloObj : {
				hi : 'hello'
			}
		},
		source : {
			two : 'two',
			three : [1,2,3],
			four : {
				five : 'five',
				six : [1,2,3],
				eleven : {
					three : 3
				},
				ten : {
					nine : 'nine',
					arr1 : [4,5, 'string']
				}
			},
			hello : {}
		},
		result : {
			one : 'one',
			three : [1,2,3],
			nine : 'nine',
			two : 'two',
			four : {
				five : 'five',
				six : [1,2,3],
				seven : 7,
				eleven : {
					three : 3
				},
				ten : {
					nine : 'nine',
					arr : [1,2],
					arr1 : [4,5, 'string']
				},
				last : {
					hello : 'world'
				}
			},
			hello : {},
			helloObj : {
				hi : 'hello'
			}
		}
	}
];
var errData = [
	{
		param : {},
		tag : 'undefined@undefined',
		name : undefined,
		msg : defaultErrConfig.defaultMessage
	},
	{
		param : {type : 'type1'},
		tag : 'type1@undefined',
		name : 'type1',
		msg : defaultErrConfig.defaultMessage
	},
	{
		param : {type : 'type1', tagString : 'tag1#tag2#tag3'},
		tag : 'type1@tag1#tag2#tag3',
		name : 'type1',
		msg : defaultErrConfig.defaultMessage
	}
]
module.exports = {
    objData : objData,
    errData : errData
}