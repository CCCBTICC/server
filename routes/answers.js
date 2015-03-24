/**
 * Created by ypling on 3/23/15.
 */
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');

/* GET home page. */
router.get('/list', function (req, res, next) {
    req.db.collection('answers').find({}, {description: 1, tags: 1}, function (err, docs) {
        res.send(JSON.stringify(docs));
    });
});
module.exports = router;