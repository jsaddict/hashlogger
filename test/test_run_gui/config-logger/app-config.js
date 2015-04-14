module.exports = {
    aggregatorToken : 'logger-token',
    aggregatorUrl: 'http://localhost:8000/aggregate',
    interval: {
        seconds : [2, 10, 30],
        minutes : [1, 15, 30],
        hours : [1, 6, 12],
        days : [1, 7],
        months : [1, 3, 4],
        years : [1]
    },
    handleError :  'log-error',
    alert : {
        'err@type4#tag-total' : { max : 15, min : 10},
        'warn@type1#tag-total' : { max : 6},
        'info@type1#tag-total' : { max : 6}
    }
};