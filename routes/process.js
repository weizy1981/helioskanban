var express = require('express');
var moment = require('moment');
var router = express.Router();

 //load the Cloudant DB
var async = require('async'),
  Cloudant = require('cloudant'),
  cloudant = Cloudant({url: process.env.CLOUDANT_URL}),
  dbname = 'kanban',
  db = cloudant.db.use(dbname),
  doc = null;

var loginCheck = function(req, res, next) {
	
	req.session.user_id = "users_test";
    if(req.session.user_id){
        next();
    }else{
       res.redirect('login');
    }
};

router.get('/', loginCheck, function(req, res) {
	db.get(req.session.user_id, function(err, data) {
		if (err) {
		throw err;
		}console.log("userdoc::" + data);
		var keyArr = new Array();
		data.processes.forEach(function(doc) {
    	  keyArr.push(doc.process_id);
		});
		var retDoc = [];
		db.view('processDoc', 'process-view', { keys: keyArr },function(err, body) {
			if (!err) {console.log("prodoc::" + body.rows);
			    body.rows.forEach(function(doc) {
			      data.processes.forEach(function(data) {
			    	  if (JSON.stringify(doc.id) == JSON.stringify(data.process_id)) {
			    		  doc.process_authority = data.process_authority;
			    		  retDoc.push(doc);
			    	  }
			      });
			    });
			    console.log("value2::" + JSON.stringify(retDoc));
			    res.render('process', { 'process': retDoc});
			}
		});
	});
});

router.post('/', loginCheck, function(req, res) {
	var time = Date.now();
	var curdate = moment(new Date()).format('YYYYMMDDHHmmss');
	var doc;

	console.log("id::" + req.body._id);
	if (req.body._id == "") {
				var id = "pro" + time;
				doc = {
						 "_id": id,
						 "type":"process",
						 "p_name": req.body.name,
						 "p_description": req.body.description,
						 "system_names":[],
						 "task_types":[],
						 "members": [{"user_id": req.session.user_id}],
						 "work_flow":[
						              {
						            	  "status_id": "1",
						            	  "status_name": "todo",
						            	  "tasks":[],
						            	  "update_time": curdate,
						            	  "description":"everyone shoud add task to this status firstly"
						              },
						              {
						            	  "status_id": "2",
						            	  "status_name": "Ready",
						            	  "tasks":[],
						            	  "update_time": curdate,
						            	  "description":"everyone shoud add task to this status firstly"
						              },
						              {
						            	  "status_id": "3",
						            	  "status_name": "In progress",
						            	  "tasks":[],
						            	  "update_time": curdate,
						            	  "description":"everyone shoud add task to this status firstly"
						              },
						              {
						            	  "status_id": "4",
						            	  "status_name": "Ready for test",
						            	  "tasks":[],
						            	  "update_time": curdate,
						            	  "description":"everyone shoud add task to this status firstly"
						              },
						              {
						            	  "status_id": "999",
						            	  "status_name": "done",
						            	  "tasks":[],
						            	  "update_time": curdate,
						            	  "description":"It has done."
						              }
						             ],
							"delflag": "false"
				 };
				console.log("nodata:" ,doc);
				db.insert(doc, function(err, data) {
						console.log("Error:", err);
						console.log("Data:", data);
						// keep the revision of the update so we can delete it
						db.get(req.session.user_id, function(err, body) {
							if (err) {
							throw err;
							}console.log("Dataprocesses:", body.processes);
							var prodoc = {};
							prodoc.process_id = data.id;
							prodoc.process_authority = "Admin";
							body.processes.push(prodoc);
							
							console.log("bodys:", body);
							doc = body;
							db.insert(doc, function(err, data) {
								if (err) {
									throw err;
								}
								//res.render('status', { 'work_flow': doc.work_flow });
								res.redirect('process');
							});
							
						});
						
				});
			}else {
				db.get(req.body._id, function(err, result) {
					if (err) {
					throw err;
					}
					doc = result;
					console.log("before:" ,result);
					if(req.body.delflag == "true"){
						doc.delflag = "true";
					}
					else {
						doc.p_description = req.body.description;
					}

					db.insert(doc, function(err, data) {
						if (err) {
							throw err;
							console.log("Error:", err);
						}
							console.log("Data:", data);
							res.redirect('process');
					});
	
				});
			}
});

module.exports = router;