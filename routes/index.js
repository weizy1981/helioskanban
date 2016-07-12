var express = require('express');
var router = express.Router();

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
        res.redirect('login');
    }
};

router.get('/', loginCheck, function(req, res) {
	db.view('kanbanviews', 'processes', function(err, processes) {
	  if (!err) {
			processes.rows.forEach(function(doc) {
				console.log(JSON.stringify(doc));
				console.log(doc.value);
			});
			// get current progress
			var process_members = {};
			db.get(req.session.user_current_process, function(err, data) {
				console.log("Error:", err);
				console.log("Data:", data);

				if (data == null || typeof(data) == "undefined") {
					console.log("fail");
					res.render('login');
				} else {
					console.log("success");
					process_members = data.members;
					res.render('index',{ "processes":processes.rows, "current_process":req.session.user_current_process, "process_members":process_members });
				}
			});
	  }
	});
});

router.post('/addmember', loginCheck, function(req, res) {
	// read current process
	var readProcess = function(callback) {
	  console.log("Reading process");
	  db.get(req.session.user_current_process, function(err, data) {
		console.log("Error:", err);
		console.log("Data:", data);
		// keep a copy of the doc so we know its revision token
		doc = data;
   	    callback(err, data);
	  });
	};

	// update current process
	var updateProcess = function(callback) {
		console.log("Updating process");
		var newUserObj = {};
		newUserObj.user_id = req.body.user_id;
		newUserObj.user_name = req.body.user_name;
		newUserObj.authority = req.body.authority;
		doc.members.push(newUserObj);
		db.insert(doc, function(err, data) {
			console.log("Error:", err);
			console.log("Data:", data);
			callback(err, data);
		});
	};

	// read user document
	var readUserInfo = function(callback) {
	  console.log("Reading User Info");
	  console.log(req.session.user_current_process);
	  db.get("users_" + req.body.user_id, function(err, data) {
		console.log("Error:", err);
		console.log("Data:", data);
		// keep a copy of the doc so we know its revision token
		doc = data;
   	    callback(err, data);
	  });
	};

	// Update User Info
	var updateUserInfo = function(callback) {
		console.log("Updating User Info");
		var newProcessObj = {};
		newProcessObj.process_id = req.session.user_current_process;
		newProcessObj.process_authority = req.body.authority;
		doc.processes.push(newProcessObj);
		db.insert(doc, function(err, data) {
			console.log("Error:", err);
			console.log("Data:", data);
			callback(err, data);
		});
	};

	async.series([readProcess, updateProcess, readUserInfo, updateUserInfo],function(err, results){
		console.log("final err:" + err);
		console.log("final results1:" + JSON.stringify(results[0]));
		console.log("final results2:" + JSON.stringify(results[1]));
		if (err === null) {
			//err = "Task has been changed edited by other user, please try again.";
			res.contentType('json');
			res.send(JSON.stringify({ "status":"ok", "err":""}));  
			res.end(); 
		} else {
			res.contentType('json');
			res.send(JSON.stringify({ "status":"ok", "err":JSON.stringify(results[1])}));  
			res.end(); 
		}
		// results is now equal to ['one', 'two']
	});
	//async.series([]);
});

router.post('/removemember', loginCheck, function(req, res) {
	// read current process
	var readProcess = function(callback) {
	  console.log("Reading process");
	  console.log(req.session.user_current_process);
	  db.get(req.session.user_current_process, function(err, data) {
		console.log("Error:", err);
		console.log("Data:", data);
		// keep a copy of the doc so we know its revision token
		doc = data;
   	    callback(err, data);
	  });
	};

	// update current process
	var updateProcess = function(callback) {
		console.log("Updating process");
		var deleteUserObj = {};
		var newMembers = new Array();
		deleteUserObj.user_id = req.body.user_id;
		deleteUserObj.user_name = req.body.user_name;
		deleteUserObj.authority = req.body.authority;
		doc.members.forEach(function(content){
			if (content.user_id == deleteUserObj.user_id ) {
			} else {
				newMembers.push(content);
			}
		});
		doc.members = newMembers;
		console.log(JSON.stringify(doc));
		db.insert(doc, function(err, data) {
			console.log("Error:", err);
			console.log("Data:", data);
			callback(err, data);
		});
	};

	// read user document
	var readUserInfo = function(callback) {
	  console.log("Reading User Info");
	  db.get("users_" + req.body.user_id, function(err, data) {
		console.log("Error:%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", err);
		console.log("Data:", data);
		// keep a copy of the doc so we know its revision token
		doc = data;
   	    callback(err, data);
	  });
	};

	// Update User Info
	var updateUserInfo = function(callback) {
		console.log("Updating User Info");
		var newProcesses = new Array();
		doc.processes.forEach(function(content){
			if (content.process_id == req.session.user_current_process ) {
			} else {
				newProcesses.push(content);
			}
		});
		doc.processes = newProcesses;
		db.insert(doc, function(err, data) {
			console.log("Error:", err);
			console.log("Data:", data);
			callback(err, data);
		});
	};

	async.series([readProcess, updateProcess, readUserInfo, updateUserInfo],function(err, results){
		console.log("final err:" + err);
		console.log("final results1:" + JSON.stringify(results[0]));
		console.log("final results2:" + JSON.stringify(results[1]));
		if (err === null) {
			//err = "Task has been changed edited by other user, please try again.";
			res.contentType('json');
			res.send(JSON.stringify({ "status":"ok", "err":""}));  
			res.end(); 
		} else {
			res.contentType('json');
			res.send(JSON.stringify({ "status":"ok", "err":JSON.stringify(results[1])}));  
			res.end(); 
		}
	});
});

router.post('/editprocessmember', loginCheck, function(req, res) {
	req.session.user_current_process = req.body.current_process;
		db.view('test123456', 'processes', function(err, processes) {
	  if (!err) {
			processes.rows.forEach(function(doc) {
				console.log(JSON.stringify(doc));
				console.log(doc.value);
			});
			// get current progress
			var process_members = {};
			db.get(req.session.user_current_process, function(err, data) {
				console.log("Error:", err);
				console.log("Data:", data);

				if (data == null || typeof(data) == "undefined") {
					console.log("fail");
					res.render('login');
				} else {
					console.log("success");
					process_members = data.members;
					//kanban_info = {"column_number":process.length}
					console.log(JSON.stringify(process_members));
					res.render('manage',{ "processes":processes.rows, "current_process":req.session.user_current_process, "process_members":process_members });
				}
			});
	  }
	});
});

router.post('/selectprocess', loginCheck, function(req, res) {
	req.session.user_current_process = req.body.current_process;
	res.send(JSON.stringify({ "status":"ok", "err":"ok"}));  
	res.end(); 
});

module.exports = router;