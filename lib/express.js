var 
	mongoose = require('mongoose')
    sys = require('sys'), 
    express = require("express"), 
    path = require("path"), 
    http = require('http'),
    fs = require('fs'),
    gm = require('gm'),
    url = require('url')
;

var crudApp = new express();


// LOG File Config
var logFile = fs.createWriteStream('./logs/crud.log', {
    flags: 'a+'
}); //use {flags: 'w'} to open in write mode

crudApp.configure('development', function(){
    crudApp.use(express.logger({
        stream: logFile
    }));
    crudApp.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));

    /**
     * Let's override all the time the method by passing the _method arg
     * Not for production environnement
     */
    crudApp.use(function(req, res, next){
		req.method = req.param('_method') ? req.param('_method') : req.method;
    	next(false);
    });
});
// Configue express
crudApp.configure(function() {
    crudApp.use(express.cookieParser());
    crudApp.use(express.bodyParser({
        uploadDir: '/var/tmp/'
        // uploadDir: './uploads/'
    }));
    crudApp.use(express.methodOverride());
    crudApp.use(express.compress());
    crudApp.use(crudApp.router);
});

crudApp.all('/:modelName/:_id?', function(req, res){
	var modelName = req.param('modelName') || false;
	var model = req.param('model') ? JSON.parse(req.param('model')) : req.body || {};
	var _id = req.param('_id') || false;
	
	if (_id !== false) { 
		model._id = _id
	}

	if (mongoose.models.hasOwnProperty(modelName)) {
		require('./model')(modelName, req.method, model, function(ret){
			res.json(ret);
		});
	}
	else {
		res.json({error: true, message: 'no model ('+modelName+') found'});
	}
});

exports = module.exports = crudApp;
