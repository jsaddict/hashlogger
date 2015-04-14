var config = {
	main : {
		port : 8500
	},
	ss : {
		delay : 200
	},
	ms : {
		delay : 200
	},
	testSpan : 13*60*60*1000,
	interval : {
		seconds : [5, 15, 30],
        minutes : [1, 10, 30],
        hours : [1, 6, 12]
	},
	db : {
		ss : 'mongodb://localhost:27017/ss',
		ms : 'mongodb://localhost:27017/ms',
		list : ['seconds5', 'seconds15', 'seconds30', 'minutes1', 'minutes10', 'minutes30', 'hours1', 'hours6', 'hours12'],
		reference : {
			'hours12' : 'hours1',
			'hours6' : 'hours1',
			'minutes30' : 'minutes1',
			'minutes15' : 'minutes1',
			'minutes1' : 'seconds5',
			'seconds30' : 'seconds5',
			'seconds15' : 'seconds5'
		}
	}
}
module.exports = config;