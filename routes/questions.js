/**
 * Created by ypling on 3/23/15.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

/* GET home page. */
router.get('/list', function (req, res, next) {
    req.db.collection('questions').find({}, {description: 1, tags: 1}, function (err, docs) {
        res.send(JSON.stringify(docs));
    });
});

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
    data.timeStamp = Date.now();
    req.db.collection('questions').insert(data, function (err, docs) {
        res.status(200);
        res.send(docs);
    });
}

function removeQuestion(req, res, data) {
    req.db.collection('questions').remove({_id: mongojs.ObjectId(data._id)}, function (err) {
        if (err == null) {
            res.status(200);
        } else {
            res.status(400);
        }
        res.send();
    });
}

module.exports = router;
