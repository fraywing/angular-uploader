/*
  angular-uploader v0.0.2
  Author: fraywing, FabryProg
  license : MIT
  Thanks for looking:-)
  
  USAGE
  1.
  <div angular-upload upload-opts='{"maxWidth" : 661, "maxHeight" : 371, "dragNdrop" : NOTWORKING, "url" : "/api/saveImage"}')</div>
  2.
  <div angular-upload upload-opts='{"maxWidth" : 661, "maxHeight" : 371, "dragNdrop" : NOTWORKING, "url" : "/api/saveImage"}', "defaultImage": "yourImage")</div>
 
 TODO
 1.Make Multiple work
 2.Conditionals for turning off drag and drop
 3.making make width and max height force a apect ration option
 4.add styles for drag and drop
 5.Give a dollar to a homeless baby
 */

var angularUploader = angular.module('angular-uploader', []);

angularUploader.directive('angularUpload', function ($http, $q, $timeout, $rootScope) {
    var methods = {
        bind: function (el) {
            var self = this;
            if(self.imageMode) {
            	el[0].addEventListener('click', function (e) {
            		$(this).find('input').trigger('click');
            	});
            }
            $(el).find('input').change(function (e) {
                self.readFile(e.target.files);
            });
            el[0].addEventListener('dragover', function (e) {
                e.preventDefault();
            });
            el[0].addEventListener('drop', function (e) {
                e.preventDefault();
                self.readFile(e.dataTransfer.files);
            });

        },
        readFile: function (e) {
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
                    var defaultImageElement = document.getElementById("default-image");
                    if(defaultImageElement) {
                    	defaultImageElement.remove();
                    }
                    
                    var img = document.createElement("img");
                    img.src = imageResult;
                    var promise = self.makeSize(img, self.options, self.imageMode);
                    
                    promise.then(function(canvas){ //normal implementation
                         self.makePreview(canvas);
                         self.saveImage(canvas);
                        });

                }
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
        makeSize: function (img, opts, imageMode) {
            var self = this;
            var canvas = document.createElement("canvas"),
                context = canvas.getContext('2d');
            	canvas.id = "canvas-"+self.code;
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
                	document.getElementById(canvas.id).addEventListener('click', function (e) {
	            		$('#file-input-'+self.code).trigger('click');
	            	});
            	}
                
            }, 400);

            return defer.promise;
        },
        makePreview: function (canvas) {
            $('.angular-upload-' + this.code).html(canvas);
        },
        saveImage: function (canvas) {
                var self = this;
                var base = canvas.toDataURL();
                $.post(self.url,{"image" : base},function(data){
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
            var code = Math.round(Math.random() * 100);
            methods.url = opts.url;
            methods.code = code;
           
            //append default image
            if(opts.defaultImage) {
            	$(el).append("<img id='default-image' src='" + opts.defaultImage + "' width='"+opts.maxWidth+"' height= '" + opts.maxHeight + "' alt='Click to upload a file'/>"); 
            	$(el).append("<input id='file-input-" + code + "' type='file' " + multi + " name='angular-file-upload' style='display:none' />");
            } else {
            	$(el).append("<input type='file' " + multi + " name='angular-file-upload'/>");
            }
            
            $(el).after("<div class='angular-upload-preview angular-upload-" + code + "'></div>");
            methods.options = opts;
            methods.imageMode = (opts.defaultImage) ? true : false;
            
            methods.bind(el);
        }
    };

});