var debug = require('debug')('dcped:img2json')
var cv = require('opencv')
var MatStream = require('opencv-image-stream')
var JPEGStream = require('jpeg-stream');

var Cam = require('./lib/ssh-cam.js')
var Detector = require('./lib/person-detector.js')

var detector = new Detector()
var jpegSplitter = new JPEGStream
var cvLoader = new MatStream()
var cam = new Cam()

// do all the plumbing
//require('fs').createReadStream('./ped.jpg')
cam.stdout
.pipe(jpegSplitter)
.pipe(cvLoader)
.pipe(detector)
.pipe(process.stdout)
