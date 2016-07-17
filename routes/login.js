var express = require('express');
var router = express.Router();
var model = require('../model');

if (process.env.hasOwnProperty("VCAP_SERVICES")) {
  // Running on Bluemix. Parse out the port and host that we've been assigned.
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var host = process.env.VCAP_APP_HOST; 
  var port = process.env.VCAP_APP_PORT;

  console.log('VCAP_SERVICES: %s', process.env.VCAP_SERVICES);    

  // Also parse out Cloudant settings.
  credentials = env['cloudantNoSQLDB'][0].credentials;
  process.env.CLOUDANT_URL = credentials.url;
}

// load the Cloudant DB
var async = require('async'),
  Cloudant = require('cloudant'),
  cloudant = Cloudant({url: process.env.CLOUDANT_URL}),
  dbname = 'kanban',
  db = null,
  doc = null;
db = cloudant.db.use(dbname);

//User nano
var nano   = require('nano')(process.env.CLOUDANT_URL)
//db = nano.use('kanban');

router.get('/', function(req, res) {
    res.render('login', { "error":"" });
});

router.post('/', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var query = {
        "user_id": email,
        "user_password": password
    };

	var cloudant_query = {
		  "selector": {
			"user_id": {
				"$eq": email
			}
		  },
		  "fields": ["_id", "_rev", "user_id", "user_password"],
		  "sort": [{"user_id": "asc"}],
		  "limit": 10,
		  "skip": 0
	  };

	// Cloudant DB 
	db.get("users_" + email, function(err, data) {
		console.log("Error:", err);
		console.log("Data:", data);

		if (data == null || typeof(data) == "undefined" || data.user_id!=email || data.user_password!=password) {
			console.log("fail");
			res.render('login', { "error":"Login failed." });
		} else {
			console.log("success");
			req.session.user_id = data.user_id;
			req.session.user_name = data.user_name;
			req.session.user_pref_default_process = data.user_pref_default_process
			req.session.user_pref_default_view = data.user_pref_default_view;
			req.session.user_current_process = data.user_pref_default_process;
			req.session.user_current_process_authority = data.user_pref_default_process;
			req.session.processes = data.processes;
			res.redirect('/');
		}
	});

/**
	var users_index = {name:'users_index', type:'json', index:{fields:['users']}}
	db.index(users_index, function(er, response) {
	  if (er) {
		throw er;
	  }

	  console.log('Index creation result: %s', response.result);
	}); 

	db.search('users','f8687943e02e45763f11ccd56815be1fae92b13b',{q:'user_id:test'},  function(err, data1) {
		console.log("Error:", err);
		console.log("Data1:", data1);
		// keep a copy of the doc so we know its revision token
		doc = data1;
	});


	 // Select User using MySQL
	 model.User.findOne({
		where: query
	}).then(function (user) {
		//console.log(user.get('user_id'));
		if (user == null || typeof(user) == "undefined" || (user.get('user_id').length==0)) {
			console.log("fail");
			res.render('login');
		} else {
			console.log("success");
			req.session.user_id = user.get('user_id');
			res.redirect('/');
		}
	});
**/

});

module.exports = router;