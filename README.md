angular-uploader
================

A sweet HTML5 multi file upload directive, with quality control, previewing, and resizing images!

###angular-uploader v0.0.1

##Requires jQuery

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
On by default, cant disable as of yet

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
  1.Make Multiple work
  2.Conditionals for turning off drag and drop
  3.making make width and max height force a apect ration option
  4.add styles for drag and drop
  5.Give a dollar to a homeless baby
