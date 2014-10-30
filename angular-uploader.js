/*
  angular-uploader v0.0.2
  Author: fraywing, FabryProg
  license : MIT
  Thanks for looking:-)
  
  USAGE
  1.
  <div angular-upload upload-opts='{"maxWidth" : 661, "maxHeight" : 371, "dragNdrop" : false, "url" : "/api/saveImage"}')</div>
  2.
  <div angular-upload upload-opts='{"maxWidth" : 661, "maxHeight" : 371, "dragNdrop" : true, "url" : "/api/saveImage"}', "defaultImage": "yourImage")</div>
 
 TODO
 1.Make Multiple work
 2.making make width and max height force a apect ration option
 3.add styles for drag and drop
 */

var angularUploader = angular.module('angular-uploader', []);

angularUploader.directive('angularUpload', function ($http, $q, $timeout, $rootScope) {
    var methods = {
        bind: function (el, code, imageMode, options) {
            var self = this;
            
            if(imageMode) {
            	el[0].addEventListener('click', function (e) {
            		$("input#file-input-" + code).trigger('click');
            	});
            }
            
            $(el).find("input#file-input-" + code).change(function (e) {
                self.readFile(e.target.files, code, imageMode, options);
            });
            
            if(options.dragNdrop) {
	            el[0].addEventListener('dragover', function (e) {
	                e.preventDefault();
	            });
	            el[0].addEventListener('drop', function (e) {
	                e.preventDefault();
	                self.readFile(e.dataTransfer.files, code, imageMode, options);
	            });
            }
            
        },
        readFile: function (e, code, imageMode, options) {
            var self = this;
            var fileRead = new FileReader();
            files = e,
            filter = /(\jpg|\png|\gif|\jpeg)/i;
            angular.forEach(files, function (file, key) {
                if (!filter.test(file.type)) {
                    alert("Not a valid image");
                    return false;
                }
                var data = fileRead.readAsDataURL(file);

                fileRead.onload = function (dataImg) {
                    var imageResult = dataImg.target.result;
                    //remove defaultImage
                    var defaultImageElement = document.getElementById("default-image-"+code);
                    if(defaultImageElement) {
                    	defaultImageElement.remove();
                    }
                    
                    var img = document.createElement("img");
                    img.src = imageResult;
                    var promise = self.makeSize(img, options, imageMode, code);
                    
                    promise.then(function(canvas){ //normal implementation
                         self.makePreview(canvas);
                         self.saveImage(canvas, options.url);
                        });

                };
            });
        },
        calcRatio: function (width, height, maxW, maxH) {

            var maxWidth = maxW; // Max width for the image
            var maxHeight = maxH; // Max height for the image
            var ratio = 0; // Used for aspect ratio

            // Check if the current width is larger than the max
            if (width > maxWidth) {
                ratio = maxWidth / width; // get ratio for scaling image
                height = height * ratio; // Reset height to match scaled image
                width = width * ratio; // Reset width to match scaled image
            }

            // Check if current height is larger than max
            if (height > maxHeight) {
                ratio = maxHeight / height; // get ratio for scaling image
                width = width * ratio; // Reset width to match scaled image
            }

            return {
                height: maxHeight,
                width: maxWidth
            };

        },
        makeSize: function (img, opts, imageMode, code) {
            var self = this;
            var canvas = document.createElement("canvas"),
                context = canvas.getContext('2d');
            	canvas.id = "canvas-"+code;
            var defer = $q.defer();

            setTimeout(function () {
                var width = img.width,
                    height = img.height;
                var newSize = self.calcRatio(width, height, opts.maxWidth, opts.maxHeight);
                canvas.width = newSize.width;
                canvas.height = newSize.height;
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                defer.resolve(canvas);
                $rootScope.$digest();
                
                //adding click event to 
                if(imageMode) {
                	var el = document.getElementById(canvas.id);
                	el.addEventListener('click', function (e) {
	            		$('#file-input-'+code).trigger('click');
	            	});
                	if(opts.dragNdrop) {
	                	el.addEventListener('dragover', function (e) {
	    	                e.preventDefault();
	    	            });
	    	            el.addEventListener('drop', function (e) {
	    	                e.preventDefault();
	    	                self.readFile(e.dataTransfer.files, code);
	    	            });
                	}
            	}
                
            }, 400);

            return defer.promise;
        },
        makePreview: function (canvas) {
            $('#'+canvas.id+'-upload-preview').html(canvas);
        },
        saveImage: function (canvas, url) {
                var base = canvas.toDataURL();
                $.post(url,{"image" : base},function(data){
                        //needs handling support
            	});
        }

    };
    return {
        replace: false,
        transclude: false,
        scope: {
            uploadOpts: '@',
            index: '@'
        },
        controller: function ($scope) {

        },
        link: function (scope, el, attr) {
            var opts = angular.fromJson(scope.uploadOpts),
                multi = opts.multi == (true || !! !undefined) ? "multiple" : "";
            var imageMode = (opts.defaultImage) ? true : false;
            var code = Math.round(Math.random() * 100);
           
            // example:
            // img#default-image-10
            // input#file-input-10
            if(opts.defaultImage) {
            	// append default image
            	$(el).append("<img id='default-image-" + code + "' src='" + opts.defaultImage + "' width='"+opts.maxWidth+"' height= '" + opts.maxHeight + "' alt='Click to upload a file'/>"); 
            	$(el).append("<input id='file-input-" + code + "' type='file' " + multi + " name='angular-file-upload' style='display:none' />");
            } else {
            	$(el).append("<input id='file-input-" + code +"' type='file' " + multi + " name='angular-file-upload'/>");
            }
            
            $(el).after("<div id='canvas-" + code + "-upload-preview' class='angular-upload-preview'></div>");

            methods.bind(el, code, imageMode, opts);
        }
    };

});