/**
 * Created by ypling on 3/23/15.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

/* GET home page. */
router.get('/list', function (req, res, next) {
    req.db.collection('answers').find({}, {description: 1, _id: 1}, function (err, docs) {
        res.send(JSON.stringify(docs));
    });
});
//Get single answer
router.get('/', function (req, res, next) {
    var _id = req.query.id;
    req.db.collection('answers').findOne({_id: mongojs.ObjectId(_id)}, {
        description: 1,
        comments: 1
    }, function (err, answer) {
        console.log(answer);
        req.db.collection('comments').find({_id: {$in: answer.comments}}, {
            _id: 1,
            description: 1
        }, function (e, comments) {
            answer.comments = comments;
            console.log(JSON.stringify(answer));
            res.write(JSON.stringify(answer));
            res.end();
        });
    });
});

router.post('/', function (req, res) {
    var action = req.body.action;
    var data = req.body.data;
    switch (action) {
        case 'create':
            createAnswer(req, res, data);
            break;
        case 'remove':
            removeAnswer(req, res, data);
            break;
    }
});

function createAnswer(req, res, data) {
    var answer = {};
    answer.timeStamp = Date.now();
    answer.questionId = data.questionId;
    answer.description = data.description;
    req.db.collection('answers').insert(answer, function (err, docs) {
        req.db.collection('questions').update(
            {_id: mongojs.ObjectId(answer.questionId)}
            , {$push: {answers: mongojs.ObjectId(docs._id)}}
            , function (err, docs) {
                console.log(docs);
                res.status(200);
                res.send(docs);
            });
    });
}

function removeAnswer(req, res, data) {
    console.log("removeAnswer");
    req.db.collection('answers').findOne({_id: mongojs.ObjectId(data._id)}, {questionId: 1,comments:1}, function (err, answer) {
        if (answer !== null) {
            req.db.collection('comments').remove({_id: {$in: answer.comments}});
            req.db.collection('questions').update({_id: mongojs.ObjectId(answer.questionId)}, {$pull: {answers: mongojs.ObjectId(data._id)}}, function (err, docs) {
                req.db.collection('answers').remove({_id: mongojs.ObjectId(data._id)}, function (err) {
                    if (err == null) {
                        res.status(200);
                    } else {
                        res.status(400);
                    }
                    res.send();
                });
            });
        }
    });
}

module.exports = router;