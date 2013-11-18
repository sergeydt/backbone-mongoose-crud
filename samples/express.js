'use strict';

// Module dependencies
var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/test');

var Cat = mongoose.model('cat', { name: String });


// Create server
var app = express();

// Configure server
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use('/CRUD', require('..').express);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


app.all('/CRUD/:modelName/:_id?', function (req, res) {
    var modelName = req.param('modelName') || false;
    console.log('req.body', req.body)
    var model = req.param('model') ? JSON.parse(req.param('model')) : req.body || {};
    var _id = req.param('_id') || false;

    if (_id !== false) {
        model._id = _id
    }

    if (mongoose.models.hasOwnProperty(modelName)) {
        console.log('here', modelName, req.method, model)
        require('./model')(modelName, req.method, model, function (ret) {
            res.json(ret);
        });
    }
    else {
        res.json({error: true, message: 'no model (' + modelName + ') found'});
    }
});

// Start server
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
