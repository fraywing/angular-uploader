angular-uploader
================

A sweet HTML5 multi file upload directive, with quality control, previewing, and resizing images!

N.B. Requires jQuery

###angular-uploader v0.0.2

##changelog

develop version
 - Add text upload instruction (layer above image)

v0.0.2

 - Adding multi-object support in a single page
 - Agging switch on/off dragNdrop functionality
 - Adding defaultImage functionality
 - BugFix 

##installation

1. Using bower 

(develop)
```
bower install https://github.com/Fabryprog/angular-uploader.git#master --save
```

(v0.0.2)
```
bower install https://github.com/Fabryprog/angular-uploader.git#v0.0.2 --save
```

2. Add css and js file

```html
...
    <link href="bower_components/angular-uploader/angular-uploader.css" rel="stylesheet">
    <script src="bower_components/angular-uploader/angular-uploader.js"></script>
...
```


***USAGE***

```html
<div angular-upload upload-opts='
{"maxWidth" : 661, "maxHeight" : 371, "dragNdrop" : true, "url" : "/api/saveImage"}')
</div>
```

***maxWidth*** 
Currently is the pixel width that your image will be resized to

***maxHeight*** 
Currently is the pixel height that your image will also be resized to

***dragNdrop*** 
On by default

***url*** 
Where to shoot your base64 encoded, resized image to!

***defaultImage***

Using a defaultImage on module load.

```html
<div angular-upload upload-opts='
{"maxWidth" : 661, "maxHeight" : 371, "dragNdrop" : true, "url" : "/api/saveImage", "defaultImage": "www/images/default/default.png" }')
</div>
```

N.B. This feature hide default button uploadfile.

***description***

This field is a description string to indicate upload instruction.

Default value is "Drop files to upload (or click)" 


***TODO***

  1.Make Multiple work<br>
  2.making make width and max height force a apect ration option<br>
  3.add styles for drag and drop
