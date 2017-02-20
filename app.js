var checkUrl = require('valid_url'),
    mongoose = require('mongoose'),
    shortid  = require('shortid'),
    express  = require('express'),
    path     = require('path'),
    app      = express();

//Requiring routes
var indexRoutes = require('./routes/index'),
    newRoutes = require('./routes/new');

//APP CONFIG
var mLab = process.env.MONGOLAB_URI || 'mongodb://localhost/url_shortener';
mongoose.connect(mLab);
app.use(express.static(path.join(__dirname, '/public')));
app.set('port', (process.env.PORT || 3000));
app.set('view engine','ejs');



app.use('/', indexRoutes);
app.use('/new', newRoutes);

app.listen(app.get('port'), function() {
    console.log('Server running on PORT ', app.get('port'));
});