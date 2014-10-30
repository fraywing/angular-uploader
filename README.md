angular-uploader
================

A sweet HTML5 multi file upload directive, with quality control, previewing, and resizing images!

N.B. Requires jQuery

###angular-uploader v0.0.2

##changelog

v.0.0.2

 - Adding multi object support
 - Agging switch on/off dragNdrop functionality
 - Adding defaultImage functionality
 - BugFix 


***USAGE***

```html
<div angular-upload upload-opts='
{"maxWidth" : 661, "maxHeight" : 371, "dragNdrop" : Can't disable, "url" : "/api/saveImage"}')
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
{"maxWidth" : 661, "maxHeight" : 371, "dragNdrop" : Can't disable, "url" : "/api/saveImage", "defaultImage": "www/images/default/default.png" }')
</div>
```


N.B. This feature hide default button uploadfile.



***TODO***

  1.Make Multiple work<br>
  2.making make width and max height force a apect ration option<br>
  3.add styles for drag and drop
