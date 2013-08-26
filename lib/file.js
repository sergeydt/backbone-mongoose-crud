var fs = require('fs');
var path = require('path');
var Mime = require('mime');
var util = require('util');
var gm = require('gm');
var formidable = require('formidable');
var LPUHelper = require('../helpers/LPUHelper');

// var uploadProgress = require('node-upload-progress');
// uploadHandler = new uploadProgress.UploadHandler;


var FILES_DIR = __dirname+"/../public/files/";
var THUMBS_DIR = __dirname+"/../public/files/thumbs/";

exports.action =  {
    name: 'files',
    description: "File manager",
    inputs: {
        "required": [],
        "optional": ['_prout', '_method', '_id', 'files','width', 'height', 'folder', 'keepOriginalName', 'crop', 'resize',
            'file0','file1','file2','file3','file4','file5','file6','file7','file8','file9','file10','file11','file12','file13','file14','file15','file16','file17','file18','file19','file20','file21','file22','file23','file24','file25','file26','file27','file28','file29','file30','file31','file32','file33','file34','file35','file36','file37','file38','file39','file40','file41','file42','file43','file44','file45','file46','file47','file48','file49','file50','file51','file52','file53','file54','file55','file56','file57','file58','file59','file60','file61','file62','file63','file64','file65','file66','file67','file68','file69','file70','file71','file72','file73','file74','file75','file76','file77','file78','file79','file80','file81','file82','file83','file84','file85','file86','file87','file88','file89','file90','file91','file92','file93','file94','file95','file96','file97','file98','file99','file100'
        ]
    },
    blockedConnectionTypes: [],
    outputExample: {},
    run: function(api, connection, next){
        var method = connection.params._method || connection.method;
        if (!fs.existsSync(FILES_DIR)) fs.mkdirSync(FILES_DIR);
        if (!fs.existsSync(THUMBS_DIR)) fs.mkdirSync(THUMBS_DIR);

        /**
         * ADD
         * @type {[type]}
         */
        if (method == "POST" && !connection.params._id) {
            // uploadHandler.upload(connection.rawConnection.req, connection.rawConnection.res);
            // console.log('pipi', connection.rawConnection.req.files);

            var
                files = [],
                filePath         = null,
                fileName         = null,
                fileExtension    = null,
                uid              = null,
                newFileName      = null,
                tmp_path         = null,
                newFilePath      = null,
                folder           = connection.params.folder !== undefined ? LPUHelper.trim(connection.params.folder, ' /') : null,
                keepOriginalName = (connection.params.folder && (connection.params.folder === 1 || connection.params.folder === '1' || connection.params.folder === 'true' || connection.params.folder === true)) ? true : false
            ;

            connection.params.files = [];
            for (var i in connection.params) {
                if (/^file[0-9]{1,4}$/.test(i)) { // don't parse the connection.params.files, only the file[0-9]
                // console.log('key', i);
                    connection.params.files.push(connection.params[i]);
                }

            }
            
            console.log('FILES', connection.params.files);

            /**
             * Multiple file
             */
    // console.log(connection.params.files);
                if (connection.params.files && connection.params.files.length > 0) {
                    for(var key = 0,len = connection.params.files.length; key < len; key++){
                        filePath        = connection.params.files[key].path;
                        fileName        = connection.params.files[key].name;

                        fileExtension   = Mime.extension(connection.params.files[key].type);
                        uid             = LPUHelper.md5('LPU'+(new Date()).getTime()+'LPURANDOMSTRING'+String((Math.random()*100)+1));
                        newFileName     = uid+'.'+fileExtension;
                        tmp_path        = __dirname + '/../' + filePath;
                        if (folder && folder.length > 0) {
                            newFilePath = folder + '/' + newFileName;
                        }
                        else {
                            newFilePath = newFileName;
                        }

                        console.log('exist?', tmp_path, fs.existsSync(tmp_path));
                        console.log('exist?', FILES_DIR+newFilePath, fs.existsSync(FILES_DIR+newFilePath));
                        fs.renameSync(tmp_path, FILES_DIR+newFilePath);
                        files.push(newFilePath);
                    }  
                }
                

            /**
             * Single file
             */
            // if (connection.params.file && connection.params.file.length > 0) {
            //     filePath        = connection.params.file.path;
            //     fileName        = connection.params.file.name;

            //     fileExtension   = Mime.extension(Mime.lookup(filePath));
            //     uid             = Crypto.md5((new Date()).getTime());
            //     newFileName     = uid+'.'+fileExtension;
            //     tmp_path        = filePath;

            //     if (folder && folder.length > 0) {
            //         newFilePath = folder + '/' + newFileName;
            //     }
            //     else {
            //         newFilePath = newFileName;
            //     }

            //     fs.renameSync(tmp_path, FILES_DIR+newFilePath);
            //     files.push(newFilePath);
            // }
            connection.response = files;
            next(connection, true);
        }

        /**
         * GET Item
         * @type {[type]}
         */
        if (method == "GET" && connection.params._id) {
            var 
                crop             = (connection.params.crop   && (connection.params.crop   === 0 || connection.params.crop   === '0' || connection.params.crop   === 'false' || connection.params.crop   === false)) ? false : true,
                resize           = (connection.params.resize && (connection.params.resize === 0 || connection.params.resize === '0' || connection.params.resize === 'false' || connection.params.resize === false)) ? false : true
            ;
            connection.params.file = connection.params._id;
            this.getFile(
                connection.params.file, 
                function(err, data, mime) {
                    // if (err) throw err; // Fail if the file can't be read.
                    if (err === true) {
                        connection.rawConnection.res.writeHead(404, {'Content-Type': 'image/jpeg'});
                        connection.rawConnection.res.end('');
                    }
                    else {
                        connection.rawConnection.res.writeHead(200, {'Content-Type': 'image/jpeg'});
                        connection.rawConnection.res.end(data);
                    }

                },
                connection.params.width,
                connection.params.height,
                resize,
                crop
            );
        }

        /**
         * DELETE Item
         * @type {[type]}
         */
        if (method == "DELETE" && connection.params._id) {
            console.log('REMOVE', connection.params._id);
            var removed = fs.unlinkSync(FILES_DIR+connection.params._id);
            connection.response.success = removed;
            next(connection, true);
            // ModelHelper.delete(connection.params._id, function(removed){
            // });
        }

    },
    /**
     * [ description]
     * @param  string   __file      filename
     * @param  function __callback  (err TRUE if not exists, fileData, mimeType, width, height) // width and height only if mime type is image
     * @param  integer  __newWidth  [description]
     * @param  integer  __newHeight [description]
     * @param  boolean  __crop      if __newHeight == 0 and __newWidth == 200 and crop == true, it keep the original height of the image and cropt its width to 200px 
     * @return void
     */
    getFile: function(__file, __callback, __newWidth, __newHeight, __resize, __crop) {
        var filepath = FILES_DIR + __file;
        
        console.log(__newWidth);

        if (fs.existsSync(filepath)) {
            var mime = Mime.lookup(filepath);
            if (mime.split('/')[0] == 'image') {
                var 
                    width  = __newWidth,
                    height = __newHeight,
                    newRatio = null,
                    ratio = null,
                    image = gm(filepath).gravity('Center')
                ;
                if (__resize && __crop && __newWidth > 0 && __newHeight > 0) {
                    newRatio = __newWidth / __newHeight;
                }
                else if (__crop && !__resize && (__newHeight > 0 || __newWidth > 0)) {
                    if (__newWidth && __newWidth > 0) width = __newWidth;
                    if (__newHeight && __newHeight > 0) height = __newHeight;
                }

                gm(filepath).size(function(err, value){
                    if (!width)  width  = value.width;
                    if (!height) height = value.height;

                    var thumbPath = THUMBS_DIR + [width, height].join('x') + '/';
                    if (!fs.existsSync(thumbPath)) fs.mkdirSync(thumbPath);
                    gm(filepath)
                        .thumb(width, height, thumbPath + path.basename(__file), 100, function(err){
                            if (!err) {
                                fs.readFile(thumbPath + path.basename(__file), function(err, data) {
                                    if (err) throw err; // Fail if the file can't be read.
                                    __callback(false, data, Mime.lookup(thumbPath + path.basename(__file)));
                                    // connection.rawConnection.responseHeaders.push(['Content-Type', Mime.lookup(thumbDir+connection.params.file)]);
                                    // connection.response(data); // Send the file data to the browser.
                                }); 
                            }
                            else {
                                console.log(err);
                            }
                        })
                    ;
                        
                });
            }
            else {
                fs.readFile(filepath, function(err, data) {
                    if (err) throw err; // Fail if the file can't be read.

                    __callback(false, data, mime);
                });
            }
        }
        else {
            __callback(true);
        }
    },
    getImageThumb: function(req, res){
        Model.findOne({_id: req.params.product_id}, function(err, product){
            if (err) {
                res.send('error', 500);
                console.log(err);
            }
            var image = null;
            for (var i = 0, len = product.files.length; i < len; i++) {
                var img = product.files[i];
                if (img == req.params.image_id) {
                    image = img;
                }
            }
            var imageDir = __dirname+'/../public/files/images/';
            if (!fs.existsSync(imageDir))fs.mkdirSync(imageDir);
            var thumbsDir = imageDir+'thumbs/';
            if (!fs.existsSync(thumbsDir))fs.mkdirSync(thumbsDir);
            var thumbDir = imageDir+'thumbs/'+req.params.width+'x'+req.params.height+'/';
            if (!fs.existsSync(thumbDir))fs.mkdirSync(thumbDir);

            if (fs.existsSync(imageDir+image)) {
                var 
                    width = req.params.width,
                    height = req.params.height
                ;
                gm(imageDir+image).size(function(err, value){
                    console.log(value);
                    newRatio = req.params.width / req.params.height;
                    ratio = value.width / value.height;
                    if ((value.width / value.height) <= ratio) {
                        height = width / ratio;
                    }
                    else {
                        width = height * ratio;
                    }
                    gm(imageDir+image)
                        .gravity('Center')
                        .thumb(connection.params.width, connection.params.height, thumbDir+image, 100, function(){
                            if (!err) {
                                fs.readFile(thumbDir+image, function(err, data) {
                                    if (err) throw err; // Fail if the file can't be read.

                                    connection.rawConnection.responseHeaders.push(['Content-Type', Mime.lookup(thumbDir+image)]);

                                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                                    res.end(data); // Send the file data to the browser.
                                });
                            }
                            else {
                                console.log(err);
                            }
                        })
                    ;
                });
            }
            else {
                res.send(JSON.stringify({success: false}), 404);
            }
        });
    }
    // getImage: function(req, res){
    //     Model.findOne({_id: req.params.product_id}, function(err, product){
    //         if (err) {
    //             res.send('error', 500);
    //             console.log(err);
    //         }
    //         var image = null;
    //         for (var i = 0, len = product.files.length; i < len; i++) {
    //             var img = product.files[i];
    //             if (img == req.params.image_id) {
    //                 image = img;
    //             }
    //         }
    //         var imageDir = __dirname+'/../public/files/images/';
    //         if (!fs.existsSync(imageDir))fs.mkdirSync(imageDir);
    //         fs.readFile(imageDir+image, function(err, data) {
    //             if (err) throw err; // Fail if the file can't be read.
    //             res.writeHead(200, {'Content-Type': 'image/jpeg'});
    //             res.end(data); // Send the file data to the browser.
    //         });
    //     });
    // }
};
