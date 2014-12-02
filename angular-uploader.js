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
            	//manage image text overlay 
            	$("img#default-image-" + code).mouseover(function (e) {
            		$("span#angular-uploader-figure-label-" + code).toggle();
            	});
            	$("img#default-image-" + code).mouseout(function (e) {
            		$("span#angular-uploader-figure-label-" + code).toggle();
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
                    var defaultImageContainerElement = document.getElementById("angular-uploader-figure-container-"+code);
                    if(defaultImageContainerElement) {
                    	defaultImageContainerElement.childNodes[0].remove();
                    }
                    
                    var img = document.createElement("img");
                    img.src = imageResult;
                    var promise = self.makeSize(img, options, imageMode, code);
                    
                    promise.then(function(canvas){ //normal implementation
                         self.makePreview(canvas);
                         self.saveImage(canvas, options.url, options.params);
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
              
                
            }, 500);

            return defer.promise;
        },
        makePreview: function (canvas) {
            
            var code = canvas.id.split("-")[1];
            
            var el = $('#'+canvas.id+'-upload-preview');
            el.html('<img src="'+canvas.toDataURL()+'" />');
            
            el.unbind("click").click(function (e) {
        		$('input#file-input-'+code).trigger('click');
        	});

        	el.unbind("dragover").on('dragover', function (e) {
                e.preventDefault();
            });
            el.unbind("drop").on('drop', function (e) {
                e.preventDefault();
                self.readFile(e.dataTransfer.files, code);
            });

        	el.unbind("mouseover").mouseover(function (e) {
        		$("span#angular-uploader-figure-label-" + code).toggle();
        	});
        	el.unbind("mouseout").mouseout(function (e) {
        		$("span#angular-uploader-figure-label-" + code).toggle();
        	});
            
        },
        saveImage: function (canvas, url, params) {
                if(url) {
                	var req = {};
                	
                	angular.forEach(Object.keys(params), function(k) {
                		req[k] = params[k];
                	});
                	req['image'] = canvas.toDataURL()
	                $http.post(url, req).success(function(data){
                        
            		}).error(function(status, data) {
            			console.log(status);
            		});
                }
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
           
            if(!opts.description) {
            	opts.description = "Drop files to upload (or click)"; //DEFAULT VALUE
            }
            
            // example:
            // img#default-image-10
            // input#file-input-10
            if(opts.defaultImage) {
            	// append default image
            	// DOM:
            	// - DIV 
            	// > - IMG
            	// > - SPAN
            	$(el).append("<div id=\"angular-uploader-figure-container-" + code + "\" class=\"angular-uploader-figure-container\"><img id='default-image-" + code + "' src='" + opts.defaultImage + "' width='"+opts.maxWidth+"' height= '" + opts.maxHeight + "' /><span id=\"angular-uploader-figure-label-" + code + "\" class=\"angular-uploader-figure-label\">"+opts.description+"</span></div>"); 
            	$(el).append("<input id='file-input-" + code + "' type='file' " + multi + " name='angular-file-upload' style='display:none' />");
            } else {
            	$(el).append("<input id='file-input-" + code +"' type='file' " + multi + " name='angular-file-upload'/>");
            }
            
        	// DOM:
        	// - DIV 
        	// > > - DIV (will be insert canvas obj)
        	// > - SPAN
            $(el).after("<div id=\"angular-uploader-figure-container-" + code + "\" class=\"angular-uploader-figure-container\"><div id='canvas-" + code + "-upload-preview' class='angular-upload-preview'></div><span id=\"angular-uploader-figure-label-" + code + "\" class=\"angular-uploader-figure-label\">"+opts.description+"</span></div>");

            methods.bind(el, code, imageMode, opts);
        }
    };

});