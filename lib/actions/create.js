exports = module.exports = function(__ModelHelper, __object, __next) {
    var model = new __ModelHelper.model(__object);
    model.save(function(err) {
        var object = {};
        if (!err) {
            if (this.emitted && this.emitted.complete.length > 0) {
              object = this.emitted.complete[0];
            }
            else {
                object = this;
            }
            console.log("save ok");
          
        }
        else {
          object = false;
        }
        __next(object);
    });
}