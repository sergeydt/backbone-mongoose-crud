exports = module.exports = function(__modelName){
    
    var action = {
          name: "CRUD"+__modelName
        , description: "crud for a mongoose model:"+__modelName
        , inputs: {
            "required": [],
            "optional": ['_method', '_id', 'model']
        }
        , blockedConnectionTypes: []
        , outputExample: {}
        , beforeRun: function(api, connection, next){
            var ModelHelper = api.mongooseHelper(__modelName);
            var Model = ModelHelper.model;
            var method = connection.params._method || connection.method;
            
            // console.log(connection.params._method);


            /**
             * LIST : GET Collection
             * @type {[type]}
             */
            if (method == "GET" && !connection.params._id) {
                ModelHelper.findAll(function(results){
                    connection.response = results;
                    if (results.length == 0) {
                        connection.error = "No items of "+__modelName+" found";
                    }
                    if (results === false) {
                        connection.error = "Error";
                    }
                    next(connection, true);
                });
            }

            /**
             * ADD
             * @type {[type]}
             */
            if (method == "POST" && !connection.params._id) {
                var model = new Model(JSON.parse(connection.params.model));

                model.save(function(err) {
                    if (!err) {
                        if (this.emitted && this.emitted.complete.length > 0) {
                          connection.response = this.emitted.complete[0];
                        }
                        else {
                            connection.response = this;
                        }
                        console.log("save ok");
                      
                    }
                    else {
                      connection.error = err;
                    }
                    next(connection, true);
                });
            }
              // console.log('LINE46');
              // console.log(connection);

            /**
             * UPDATE
             * @type {[type]}
             */
            if((method == "PUT" || method == "PATCH") && connection.params._id) {
                ModelHelper.update(connection.params._id, JSON.parse(connection.params.model), function(result){
                    connection.response = result;
                    if (result === false) {
                        connection.error = 'Error';
                    }
                    next(connection, true);
                });
            }


            /**
             * GET Item
             * @type {[type]}
             */
            if (method == "GET" && connection.params._id) {
                ModelHelper.findById(connection.params._id, function(result){
                    connection.response = result;
                    if (result === false) {
                        connection.error = 'Error';
                    }

                    next(connection, true);

                })
            }

            /**
             * DELETE Item
             * @type {[type]}
             */
            if (method == "DELETE" && connection.params._id) {
                ModelHelper.delete(connection.params._id, function(removed){
                    connection.response.success = removed;
                    next(connection, true);
                })
            }

        }
    }
    return action;
};

