var express = require('express');
var checkUrl = require('valid_url');
var router = express.Router();
var Url = require('../models/url.js');
var shortid  = require('shortid');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/:url(*)',function(req,res) {
    // var local = req.hostname;
    var local = req.headers.host;
    var inputUrl = req.params.url;
    
    if (checkUrl(inputUrl)){
        if(inputUrl.slice(0,4) !== 'http') {
            inputUrl = 'http://' + inputUrl;
        }
        Url.find({url: inputUrl}, function(err, urlData) {
            if(err) {
                console.log(err);
            } else {
                if(urlData.length === 0) {

                    var urlObj = {url: inputUrl, short: shortid.generate()};
                    Url.create(urlObj, function(err, newUrl) {
                        if(err) {
                            console.log(err);
                        } else {
                            var original_url = newUrl.url;
                            var short_url = local + '/' + newUrl.short;
                            res.json({original_url: original_url, short_url: short_url});
                        }
                    });
                } else {
                    var original_url = urlData[0].url;
                    var short_url = local + '/' + urlData[0].short;
                    res.json({original_url: original_url, short_url: short_url});
                }
            }
        })
    } else {
        res.json({error :"Wrong url format, make sure you have a valid protocol and real site."});
    }
});

module.exports = router;