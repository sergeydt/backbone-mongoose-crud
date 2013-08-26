exports = module.exports = function(__modelHelper, __next) {
    __modelHelper.findAll(function(results){
        __next(results);
    });
}
