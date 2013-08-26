exports = module.exports = function(__ModelHelper, __id, __object, __next) {
	__ModelHelper.update(_id, __object, function(result){
	    __next(result);
	});
};