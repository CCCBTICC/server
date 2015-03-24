/**
 * Created by ypling on 3/23/15.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var objectId = mongojs.ObjectId;

/* GET home page. */
router.get('/list', function (req, res, next) {
    req.db.collection('questions').find({}, {description: 1, tags: 1}, function (err, docs) {
        res.send(JSON.stringify(docs));
    });
});

router.post('/', function (req, res) {
    var action = req.body.action;
    var data = req.body.data;

    console.log(req.body);
    switch (action) {
        case 'create':
            req.db.collection('questions').insert(data, function (err, docs) {
                console.log(docs);
            });
            res.status(200);
            res.send();
            break;
        case 'remove':
            req.db.collection('questions').remove({_id: mongojs.ObjectId(data._id)}, function (err) {
                if (err == null) {
                    res.status(200);
                } else {
                    res.status(400);
                }
                res.send();
            });
            break;
    }
});

module.exports = router;
