exports.action = require('../helpers/crud')('Post');

exports.action.run = function(api, connection, next) {
    this.beforeRun(api, connection, next);
}
