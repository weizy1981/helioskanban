var express = require('express');
var router = express.Router();

var loginCheck = function(req, res, next) {
    if(req.session.user_id){
        next();
    }else{
        res.redirect('login');
    }
};

var async = require('async'),
  Cloudant = require('cloudant'),
  cloudant = Cloudant({url: process.env.CLOUDANT_URL}),
  dbname = 'kanban',
  db = null,
  doc = null;
db = cloudant.db.use(dbname);

/* GET users listing. */
router.get('/', loginCheck, function(req, res) {
    res.render('feedback');
});

router.post('/', loginCheck, function(req, res) {
    console.log(req.body);

    var user_id = req.session.user_id;
    var user_name = req.body.name;
    var email = req.body.email;
    var impression = req.body.impression;
    var report = req.body.report;
    var comment = req.body.comment;

  	db.insert({ _id: "users_" + user_id + new Date().getTime(),"type": "feedback" , "user_id":user_id, "user_name":user_name, "email": email, "impression":impression, 
			"report": report,"comment": comment}, function(err, data) {
		console.log("Error:", err);
		console.log("Data:", data);
	});

    res.redirect('/');
});

//***********************************************************************
// List Feedbacks
//***********************************************************************
router.get('/list', loginCheck, function(req, res) {
	req.session.user_current_process = req.body.current_process;
	db.view('kanbanviews', 'feedback', function(err, feedbacks) {
	  if (!err) {

			feedbacks.rows.forEach(function(doc) {
				console.log(JSON.stringify(doc));
				console.log(doc._id);
			});
			console.log("success");
			res.render('feedbacks',{ "feedbacks":feedbacks});
	  }
	});
});

module.exports = router;
