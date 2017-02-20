var express = require('express');
var router = express.Router();
var Url = require('../models/url.js');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/:code', function(req, res) {
    Url.findOne({short: req.params.code}, 'url', function (err, urlData) {
        if(err) {
            console.log(err);
        } else {
            if(urlData) {
                res.redirect(urlData.url);
            } else {
                res.json({error: "This url is not on the database."});
            }
        }
    })
});

module.exports = router;