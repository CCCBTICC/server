/**
 * Created by ypling on 3/23/15.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

/* GET home page. */
router.get('/list', function (req, res, next) {
    req.db.collection('comments').find({}, {description: 1, tags: 1}, function (err, docs) {
        res.send(JSON.stringify(docs));
    });
});

router.post('/', function (req, res) {
    console.log(req.body);
    var action = req.body.action;
    var data = req.body.data;
    switch (action) {
        case 'create':
            createComment(req, res, data);
            break;
        case 'remove':
            removeComment(req, res, data);
            break;
    }
});

function createComment(req, res, data){
    var comment={};
    comment.timeStamp = Date.now();
    comment.answerId = data.answerId;
    comment.description = data.description;
    req.db.collection('comments').insert(comment, function (err, docs) {
        req.db.collection('answers').update(
            {_id:mongojs.ObjectId(comment.answerId)}
            ,{$push:{comments:mongojs.ObjectId(docs._id)}}
            ,function(err,docs){
                console.log(docs);
                res.status(200);
                res.send(docs);
            });
    });
}

function removeComment(req, res, data){
    req.db.collection('comments').findOne({_id:mongojs.ObjectId(data._id)},{answerId:1}, function (err,comment) {
        req.db.collection('answers').update({_id:mongojs.ObjectId(comment.answerId)},{$pull:{comments:mongojs.ObjectId(data._id)}}, function (err,docs) {
            req.db.collection('comments').remove({_id: mongojs.ObjectId(data._id)}, function (err) {
                if (err == null) {
                    res.status(200);
                } else {
                    res.status(400);
                }
                res.send();
            });
        });
    });
}

module.exports = router;