'use strict';

var express = require('express');
var router = express.Router();

var watson = require('watson-developer-cloud');
//var fs     = require('fs');

var natural_language_classifier = watson.natural_language_classifier({
  url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
  username: 'dadd0df1-1e00-43ad-94f5-679576c7fc75',
  password: 'Am2zgRWDWVNN',
  version: 'v1'
});

// load the Cloudant DB
var async = require('async'),
  Cloudant = require('cloudant'),
  cloudant = Cloudant({url: process.env.CLOUDANT_URL}),
  dbname = 'kanban',
  db = null,
  doc = null;
var doc_process = null;
db = cloudant.db.use(dbname);

var loginCheck = function(req, res, next) {
    if(req.session.user_id){
        next();
    }else{
        res.render('login', { "error":"" });
    }
};

// Creating a classifier
/**
var params = {
  language: 'ja',
  name: 'task-classifier',
  training_data: fs.createReadStream('../resources/task_train.csv')
};


natural_language_classifier.create(params, function(err, response) {
  if (err)
    console.log(err);
  else
    // copy the classifier_id from the response
    console.log(JSON.stringify(response, null, 2));
});
*/



//***********************************************************************
// Task classify
//**********************************************************************
router.post('/classify', loginCheck, function(req, res) {
	// Using a classifier
	natural_language_classifier.classify({
	  text: req.body.task_name,
	  classifier_id: '74df3fx91-nlc-1227' }, // from the previous command
	  function(err, response) {
		if (err)
			console.log('error:', err);
		else
			console.log(JSON.stringify(response, null, 2));
			var data = {};
			data.status = "OK";
			data.result = response;
			//data = {"status": "OK", "message":"task deleted."}
			res.end(JSON.stringify(data))
	});
});


router.post('/tradeoff', loginCheck, function(req, res) {
	var TradeoffAnalyticsV1 = require('watson-developer-cloud/tradeoff-analytics/v1');

	var tradeoff_analytics = new TradeoffAnalyticsV1({
	  username: 'e5beb1bc-c48f-492b-8ac4-999d8cdb57db',
	  password: 'M6tlJX5Typmg'
	});
	console.log("**********************************************8");
	//console.log(req.body.tradeoffjson);
	var tradeoffjson = JSON.parse(req.body.tradeoffjson);
	console.log(tradeoffjson);
	// From file
	var params = require('../resources/todotasks.json');
	var option = {};
	var now = new Date();
	var newKey =  now.getTime();
	option.key = newKey;
	option.name = "Task 006";
	option.values = {
      "importance": "H",
      "emergency": "H",
      "deadline": "2016-08-09T00:00:00+09:00"
    }

/*
	// read current process
	  console.log("Reading process");;
	  db.get(req.session.user_current_process, function(err, data) {
		console.log("Error****************************:", err);
		//console.log("Data:", data);
		// keep a copy of the doc so we know its revision token
		console.log(data.work_flow);
		var todoTasks = data.work_flow[0].tasks;
		console.log(todoTasks);
	  });

	async.parallel({ 
		a: function(cb) { t.fire('a400', cb, 400) }, 
		b: function(cb) { t.fire('c300', cb, 300) } 
	}, function(err, results) { 
		log('1.3 err: ', err); // -> undefined 
		log('1.3 results: ', results); // -> { b: Åec300Åå, a: Åea400Åå } 
	});
*/
	params.options.push(option);
	params.options=tradeoffjson;
	console.log(params);
	tradeoff_analytics.dilemmas(params, function(err, response) {
	  if (err)
		console.log(err);
	  else
		console.log(JSON.stringify(response, null, 2));
		var data = {};
		data.status = "OK";
		data.result = response;
		//data = {"status": "OK", "message":"task deleted."}
		res.end(JSON.stringify(data))
	});
});

module.exports = router;