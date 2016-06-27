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
	
	var email = req.body.email;
    var password = req.body.password;
	// we are specifying the id of the document so we can update and delete it later
	db.insert({ _id: "users_" + email, "user_id":email, "user_password": password}, function(err, data) {
		console.log("Error:", err);
		console.log("Data:", data);
		res.render('register',{ "status": "ok", "message":"register success." });
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