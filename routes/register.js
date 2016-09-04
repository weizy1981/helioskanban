var express = require('express');
var router = express.Router();
var model = require('../model');
var User = model.User;

// load the Cloudant DB
var async = require('async'),
  Cloudant = require('cloudant'),
  cloudant = Cloudant({url: process.env.CLOUDANT_URL}),
  dbname = 'kanban',
  db = null,
  doc = null;
db = cloudant.db.use(dbname);

router.get('/', function(req, res) {
    res.render('register',{ "status": "ng", "message":"register" });
});

router.post('/', function(req, res) {
	
	var user_id = req.body.user_id;
    var user_password = req.body.user_password;
	var user_name = req.body.user_name;
	console.log(user_id);
	db.insert({ _id: "users_" + user_id, "user_name":user_name, "user_id":user_id, "user_password": user_password, "type":"user", 
			"processes": [{"process_id": "process_sample","process_name": "Sample Process","process_authority": "viewer"}],
			"user_pref_default_view":"kanban","user_pref_default_process": "process_sample"}, function(err, data) {
		console.log("Error:", err);
		console.log("Data:", data);
		var resultdata = {};
		if (err) {
			resultdata = { "status": "ng", "message":"register failed." };
		} else {
			resultdata = { "status": "ok", "message":"register success." };
		}
		res.end(JSON.stringify(resultdata))
	});

	// Insert User using MySQL getTime()
	/**
	User
	  .build({ user_id: email, user_password: password})
	  .save()
	  .then(function(anotherTask) {
		// you can now access the currently saved task with the variable anotherTask... nice!
		console.log("saved");
		res.redirect('/');
	  }).catch(function(error) {
		 console.log(err);
         res.redirect('back');
	  })
	 **/
});

module.exports = router;