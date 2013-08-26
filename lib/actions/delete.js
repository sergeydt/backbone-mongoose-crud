exports = module.exports = function(__ModelHelper, __id, __next) {
	__ModelHelper.delete(__id, function(removed){
	    __next(removed);
	});
};