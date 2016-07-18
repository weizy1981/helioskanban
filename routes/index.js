var express = require('express');
var router = express.Router();

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
var doc_process = null;
db = cloudant.db.use(dbname);

var loginCheck = function(req, res, next) {
    if(req.session.user_id){
        next();
    }else{
        res.redirect('login');
    }
};

//***********************************************************************
// Show Process List
//***********************************************************************
router.get('/', loginCheck, function(req, res) {
	if (!req.session.action_name) {
		req.session.action_name = "";
	}
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
				res.render('login',{ "error":"" });
			} else {

				console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%req.session.data:" + data);
				console.log("success");
				process_members = data.members;
				process_workflow = data.work_flow;
				console.log(process_members);
				console.log("***************************************************");
				res.render('index',{ "login_user_id":req.session.user_id, "processes":req.session.processes, "current_process":req.session.user_current_process, "process_workflow":process_workflow, "process_members":process_members, "action_name":req.session.action_name });
			}
		});
	  }
	});
});

//***********************************************************************
// Add Process
//***********************************************************************
router.post('/addprocess', loginCheck, function(req, res) {
	var process_id = req.body.current_process;
	req.session.user_current_process = process_id;
	var process_name = req.body.process_name;
	// New Process
	var insertProcess = function(callback) {
		db.insert({ _id: process_id, "type":"process", "p_name":process_name,
			"members": [{
			  "user_id": req.session.user_id,
			  "user_name": req.session.user_name,
			  "authority": "Admin"
			}], 
			"work_flow": [
				{
				  "status_id": "1",
				  "status_name": "ToDo",
				  "tasks": [],
				  "update_time": "",
				  "description": "Everyone shoud add task to this column firstly."
				},
				{
				  "status_id": "2",
				  "status_name": "In Process",
				  "tasks": [],
				  "update_time": "",
				  "description": "Put tasks on going  to this column."
				},
				{
				  "status_id": "999",
				  "status_name": "Done",
				  "tasks": [
				  ],
				  "update_time": "",
				  "description": "Put tasks finished to this column."
				}
			]
			}, function(err, data) {
				console.log("Error:", err);
				console.log("Data:", data);
				callback(err, data);
		});
	};

	// read user document
	var readUserInfo = function(callback) {
	  console.log("Reading User Info");
	  console.log("*****************************************************************88");
	  db.get("users_" + req.session.user_id, function(err, data) {
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
		newProcessObj.process_name = process_name;
		newProcessObj.process_authority = "Admin";
		doc.processes.push(newProcessObj);
		req.session.processes = doc.processes;
		db.insert(doc, function(err, data) {
			console.log("Error:", err);
			console.log("Data:", data);
			callback(err, data);
		});
	};

	async.series([insertProcess, readUserInfo, updateUserInfo],function(err, results){
		console.log("final err:" + err);
		if (err === null) {
			//err = "Task has been changed edited by other user, please try again.";
			res.contentType('json');
			res.send(JSON.stringify({ "status":"ok", "err":""}));  
			res.end(); 
		} else {
			res.contentType('json');
			res.send(JSON.stringify({ "status":"ok", "err":""}));  
			res.end(); 
		}
		// results is now equal to ['one', 'two']
	});
});

//***********************************************************************
// Save Work Flow
//***********************************************************************
router.post('/saveworkflow', loginCheck, function(req, res) {

	// read current process
	var readProcess = function(callback) {
	  console.log("Reading process");;
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
		doc.work_flow = JSON.parse(req.body.new_workflow);
		console.log(doc.work_flow);
		db.insert(doc, function(err, data) {
			console.log("Error:", err);
			console.log("Data:", data);
			callback(err, data);
		});
	};

	async.series([readProcess, updateProcess],function(err, results){
		console.log("final err:" + err);
		if (err === null) {
			//err = "Task has been changed edited by other user, please try again.";
			res.contentType('json');
			res.send(JSON.stringify({ "status":"ok", "err":""}));  
			res.end(); 
		} else {
			res.contentType('json');
			res.send(JSON.stringify({ "status":"ok", "err":""}));  
			res.end(); 
		}
	});
});

//***********************************************************************
// Change Process Name
//***********************************************************************
router.post('/changeprocessname', loginCheck, function(req, res) {
	var process_id = req.session.user_current_process;
	var process_name = req.body.new_process_name;

	// read current process
	var readProcess = function(callback) {
	  console.log("Reading process");;
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
		doc.p_name = process_name;
		db.insert(doc, function(err, data) {
			console.log("Error:", err);
			console.log("Data:", data);
			// keep the revision of the update so we can delete it
			doc._rev = req.body.rev;
			callback(err, data);
		});
	};

	// read user document
	var readUserInfo = function(callback) {
	  console.log("Reading User Info");
	  db.get("users_" + req.session.user_id, function(err, data) {
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
		var processesArray = new Array();
		doc.processes.forEach(function(content){
			if (content.process_id === req.session.user_current_process) {
				content.process_name = req.body.new_process_name;
			}
			processesArray.push(content);
		});
		doc.processes = processesArray;
		req.session.processes = processesArray;
		db.insert(doc, function(err, data) {
			console.log("Error:", err);
			console.log("Data:", data);
			callback(err, data);
		});
	};

	async.series([readProcess, updateProcess, readUserInfo, updateUserInfo],function(err, results){
		console.log("final err:" + err);
		if (err === null) {
			//err = "Task has been changed edited by other user, please try again.";
			res.contentType('json');
			res.send(JSON.stringify({ "status":"ok", "err":""}));  
			res.end(); 
		} else {
			res.contentType('json');
			res.send(JSON.stringify({ "status":"ok", "err":""}));  
			res.end(); 
		}
		// results is now equal to ['one', 'two']
	});
});

//***********************************************************************
// Add Process Member
//***********************************************************************
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
		newProcessObj.process_name = req.session.user_current_process_name;
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

//***********************************************************************
// Remove Process Member
//***********************************************************************
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
	req.session.action_name =  req.body.action_name;
	req.session.user_current_process_name = req.body.current_process_name;
	res.send(JSON.stringify({ "status":"ok", "action_name":req.session.action_name}));  
	res.end(); 
});

module.exports = router;