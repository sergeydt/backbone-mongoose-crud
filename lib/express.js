var 
	mongoose = require('mongoose')
;

exports = module.exports = function(req, res){
	req.method = req.param('_method') ? req.param('_method') : req.method;
	var modelName = req.param('modelName');
	if (mongoose.models.hasOwnProperty(modelName)) {
		require('./model')(modelName, req.method, req.body, function(ret){
			res.json(ret);
		});
	}
	else {
		res.json({error: true, message: 'no model ('+modelName+') found'});
	}
};

