var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var listener = require('./routes/listener');
var cron = require('node-cron');
const dotenv = require('dotenv').config();
var axios = require('axios').default;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/listener', listener);

axios.defaults.baseURL = process.env.GS_URL;
axios.defaults.withCredentials = true;

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});


cron.schedule('*/1 * * * *', () => {
	serviceOneMin();
	serviceCommand();
});

cron.schedule('*/5 * * * *', () => {
	serviceFiveMin();
});


cron.schedule('*/30 * * * *', () => {
	serviceThirtyMin();
});

cron.schedule('*/60 * * * *', () => {
	serviceSixtyMin();
});

cron.schedule('59 11 * * *', () => {
	serviceTwelveHour();
});

// cron.schedule('59 23 * * *', () => {
// 	serviceTwentyFourHour();
// });

function serviceOneMin() {
    axios({
		url: 'server/s_service.php',
		method: 'get',
		headers: {
			'Content-Type': 'application/json'
		},
		data:JSON.stringify({
			"op": "service_1min"
		  })
	  })
	  .then(function(response) {
		console.log("1 min service Data : "+response.data);
	  })
	  .catch(function(error) {
		console.log(error)
	  })
}

function serviceCommand() {
    axios({
		url: 'server/s_service.php',
		method: 'get',
		headers: {
			'Content-Type': 'application/json'
		},
		data:JSON.stringify({
			"op": "get_cmd_exec"
		  })
	  })
	  .then(function(response) {
		  console.log(response.data);
		console.log("Check command queue");
	  })
	  .catch(function(error) {
		console.log(error)
	  })
}

function serviceFiveMin() {
    axios({
		url: 'server/s_service.php',
		method: 'get',
		headers: {
			'Content-Type': 'application/json'
		},
		data:JSON.stringify({
			"op": "service_5min"
		  })
	  })
	  .then(function(response) {
		console.log("5 min service Data : "+response.data);
	  })
	  .catch(function(error) {
		console.log(error)
	  })
}

function serviceThirtyMin() {
    axios({
		url: 'server/s_service.php',
		method: 'get',
		headers: {
			'Content-Type': 'application/json'
		},
		data:JSON.stringify({
			"op": "service_30min"
		  })
	  })
	  .then(function(response) {
		console.log("30 min service Data : "+response.data);
	  })
	  .catch(function(error) {
		console.log(error)
	  })
}

function serviceSixtyMin() {
    axios({
		url: 'server/s_service.php',
		method: 'get',
		headers: {
			'Content-Type': 'application/json'
		},
		data:JSON.stringify({
			"op": "service_1h"
		  })
	  })
	  .then(function(response) {
		console.log("1 hour service Data : "+response.data);
	  })
	  .catch(function(error) {
		console.log(error)
	  })
}

function serviceTwelveHour() {
    axios({
		url: 'server/s_service.php',
		method: 'get',
		headers: {
			'Content-Type': 'application/json'
		},
		data:JSON.stringify({
			"op": "service_12h"
		  })
	  })
	  .then(function(response) {
		console.log("12 hour service Data : "+response.data);
	  })
	  .catch(function(error) {
		console.log(error)
	  })
}

// function serviceTwentyFourHour() {
//     axios({
// 		url: '/s_service.php',
// 		method: 'get',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		data:JSON.stringify({
// 			"op": "service_1min"
// 		  })
// 	  })
// 	  .then(function(response) {
// 		console.log("24 hour service Data : "+response.data);
// 	  })
// 	  .catch(function(error) {
// 		console.log(error)
// 	  })
// }

module.exports = app;
