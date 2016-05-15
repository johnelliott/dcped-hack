// static server
var http = require('http');
var url = require('url');

var debug = require('debug')('dcped:server');
var ecstatic = require('ecstatic');
var WebSocketServer = require('ws').Server
var cv = require('opencv')
var MatStream = require('opencv-image-stream')
var JPEGStream = require('jpeg-stream');

var Cam = require('./lib/ssh-cam.js')
var Detector = require('./lib/person-detector.js')

// Middleware
var staticMiddleware = ecstatic({ root: __dirname + '/public' });

// Server
var port = process.env.PORT || 8080;
var server = http.createServer(function requestHandler (req, res) {
  // Add other middleware here
  staticMiddleware(req, res);
});

// Websocket server
var wss = new WebSocketServer({ server })
wss.on('connection', function connection(ws) {
  debug('we have a socket connection')

  var detector = new Detector()
  var jpegSplitter = new JPEGStream
  var cvLoader = new MatStream()
  var cam = new Cam()

  // do all the plumbing
  //require('fs').createReadStream('./ped.jpg')
  cam.stdout
  .pipe(jpegSplitter)
  .pipe(cvLoader)
  .pipe(detector).on('data', function(data) {
    debug('data', data)
    // TODO see if ws is a useful stream
    ws.send(data)
  })


  ws.on('message', function incoming(message) {
    debug('received: %s', message);
  });
  //var newState = [ { x: 38, y: 24, width: 55, height: 45 } ]
  //// TODO stream this in from raspi camera
  //ws.send(JSON.stringify(newState));
});


// Start server
server.listen(port);
debug('Server listening on ' + port);
