var checkUrl = require('valid_url'),
    mongoose = require('mongoose'),
    shortid  = require('shortid'),
    express  = require('express'),
    path     = require('path'),
    app      = express();

//APP CONFIG
var mLab = process.env.MONGOLAB_URI || 'mongodb://localhost/url_shortener';
mongoose.connect(mLab);
app.use(express.static(path.join(__dirname, '/public')));
app.set('port', (process.env.PORT || 3000));
app.set('view engine','ejs');

//MONGOOSE MODEL CONFIG
var urlSchema = new mongoose.Schema({
    url: String,
    short: {type: String, default: shortid.generate}
});
var Url = mongoose.model('Url', urlSchema);

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/new', function(req, res) {
    res.render('index');
});

app.get('/new/:url(*)',function(req,res) {
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

app.get('/:code', function(req, res) {
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

app.listen(app.get('port'), function() {
    console.log('Server running on PORT ', app.get('port'));
});