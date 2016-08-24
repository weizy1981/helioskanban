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


router.get('/tradeoff', loginCheck, function(req, res) {
	var TradeoffAnalyticsV1 = require('watson-developer-cloud/tradeoff-analytics/v1');

	var tradeoff_analytics = new TradeoffAnalyticsV1({
	  username: 'e5beb1bc-c48f-492b-8ac4-999d8cdb57db',
	  password: 'M6tlJX5Typmg'
	});

	// From file
	var params = require('../resources/todotasks.json');

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