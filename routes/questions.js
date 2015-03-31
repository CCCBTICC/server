/**
 * Created by ypling on 3/23/15.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

//Get question list
router.get('/list', function (req, res, next) {
    req.db.collection('questions').find({}, {title: 1, description: 1, tags: 1}, function (err, docs) {
        res.send(JSON.stringify(docs));
    });
});
//Get single question
router.get('/', function (req, res, next) {
    var _id = req.query.id;
    //console.log(_id);
    req.db.collection('questions').findOne({_id: mongojs.ObjectId(_id)}, {
        title: 1,
        description: 1,
        tags: 1,
        answers: 1
    }, function (err, question) {
        req.db.collection('answers').find({_id: {$in: question.answers}}, {
            _id: 1,
            description: 1,
            comments:1
        }, function (e, answers) {
            question.answers = answers;
            console.log(JSON.stringify(question));
            res.write(JSON.stringify(question));
            res.end();
        });
    });
});
//create and remove question;
router.post('/', function (req, res) {
    var action = req.body.action;
    var data = req.body.data;
    switch (action) {
        case 'create':
            createQuestion(req, res, data);
            break;
        case 'remove':
            removeQuestion(req, res, data);
            break;
    }
});

function createQuestion(req, res, data) {
    var question = {};
    question.timeStamp = Date.now();
    question.title = data.title;
    question.description = data.description;
    question.tags = data.tags;

    req.db.collection('questions').insert(question, function (err, docs) {
        res.status(200);
        res.send(docs);
    });
}

function removeQuestion(req, res, data) {
    req.db.collection('questions').findOne({_id: mongojs.ObjectId(data._id)},{answers:1},function(err,question){
        if(question!==null) {
            req.db.collection('answers').remove({_id: {$in: question.answers}});
        }

        req.db.collection('questions').remove({_id: mongojs.ObjectId(data._id)}, function (err) {
            if (err == null) {
                res.status(200);
            } else {
                res.status(400);
            }
            res.send();
        });
    });
}

module.exports = router;
