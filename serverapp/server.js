var express = require('express');
var app = express();
var _ = require('underscore');

app.use(express.methodOverride());
app.use(express.bodyParser());
// ## CORS middleware
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
var myGlobalData = {
	list: [],
	counter: 0
};
app.use(allowCrossDomain);

app.get('/', function(req, res){
  res.send(myGlobalData.list);
  myGlobalData.counter++;
  console.log(myGlobalData.counter+'. dat request doe: '+new Date());
});

app.post('/', function(req, res){
	console.log(req.body);
	var dis = _.find(myGlobalData.list, function(obj){return (obj.name == req.body.name && obj.score == req.body.score)});
	if(dis === undefined){
		myGlobalData.list.push(req.body);
		myGlobalData.list = _.sortBy(myGlobalData.list, function(obj){return obj.score * -1;});
	}
});

app.listen(15000);
console.log('Listening on port 15000');