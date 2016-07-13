var express = require('express');
var router = express.Router();

// load the Cloudant DB
var async = require('async'),
  Cloudant = require('cloudant'),
  cloudant = Cloudant({url: process.env.CLOUDANT_URL}),
  dbname = 'kanban',
  db = null,
  doc = null;
db = cloudant.db.use(dbname);

var loginCheck = function(req, res, next) {
    if(req.session.user_id){
        next();
    }else{
        res.redirect('login');
    }
};

router.get('/', loginCheck, function(req, res) {
		var beforeNum = -1;
		var ondateNum = -1;
		var afterNum = -1;

		var readKeyZero = function (callback) {
			db.get('_design/jhtest/_view/task-status-view?key="0"', function (err, result) {
			if(err)
				console.log("error======");
			else{
				console.log(JSON.stringify(result));
				beforeNum = result.rows[0].value;
			}
			callback(err, "");
			});
		}


		var readKeyOne = function(callback){
			//--------------second------------
			db.get('_design/jhtest/_view/task-status-view?key="1"', function (err, result) {
			if(err)
				console.log("error======");
			else{
				console.log(JSON.stringify(result));
				ondateNum = result.rows[0].value;
			}
			callback(err, "");
			});
		}


		var readKeyTwo = function(callback){
			//-----------third------------
			db.get('_design/jhtest/_view/task-status-view?key="2"', function (err, result) {
			if(err)
				console.log("error======");
			else{
				console.log(JSON.stringify(result));
				afterNum = result.rows[0].value;
			}
			callback(err, "");
			});
		}


	async.series([readKeyZero, readKeyOne, readKeyTwo,],function(err, results){
		console.log(beforeNum);
		console.log(ondateNum);
		console.log(afterNum);
		res.render('duedate',{ "before": beforeNum, "ondate":ondateNum, "after": afterNum });
	});
});

module.exports = router;