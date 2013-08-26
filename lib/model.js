// CRUD actions for backbone models persistence
var mongooseHelper = require('mongoose-helper');
exports = module.exports = function(__modelName, __method, __model, __next){
    var ModelHelper = mongooseHelper(__modelName);

    /**
     * LIST : GET Collection
     * @type {[type]}
     */
    if (__method == "GET" && !__model._id) {
        console.log('LIST '+__modelName);
        require('./actions/list')(ModelHelper, __next);
    }

    /**
     * ADD
     * @type {[type]}
     */
    if (__method == "POST" && !__model._id) {
        console.log('ADD '+__modelName);
        require('./actions/create')(ModelHelper, __model, __next);
    }

    /**
     * UPDATE
     * @type {[type]}
     */
    if((__method == "PUT" || __method == "PATCH") && __model._id) {
        console.log('UPDATE '+__modelName);
        require('./actions/update')(ModelHelper, __model._id, __model, __next);
    }


    /**
     * GET Item
     * @type {[type]}
     */
    if (__method == "GET" && __model._id) {
        console.log('READ '+__modelName);
        require('./actions/read')(ModelHelper, __model._id, __next);
    }

    /**
     * DELETE Item
     * @type {[type]}
     */
    if (__method == "DELETE" && __model._id) {
        console.log('DELETE '+__modelName);
        require('./actions/delete')(ModelHelper, __model._id, __next);
    }

};

