var mongoose = require('mongoose');
var shortid  = require('shortid');

//MONGOOSE MODEL CONFIG
var urlSchema = new mongoose.Schema({
    url: String,
    short: {type: String, default: shortid.generate}
});

module.exports = mongoose.model('Url', urlSchema);