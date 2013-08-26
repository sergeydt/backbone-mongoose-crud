exports = module.exports = function(__ModelHelper, __id, __next) {
	__ModelHelper.findById(__id, function(result){
	    __next(result);
	});
};