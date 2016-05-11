var stream = require('stream')

var cv = require('opencv')
var MatStream = require('opencv-image-stream')
var JPEGStream = require('jpeg-stream');

var Cam = require('./lib/ssh-cam.js')

var cam = new Cam()
var jpegSplitter = new JPEGStream;
var matStream = new MatStream() // matStream stream
const model = 'node_modules/opencv/data/haarcascade_upperbody.xml'

cam.stdout.pipe(jpegSplitter).pipe(matStream).on('data', gotImage)

function gotImage(im) {
  if (im.width() < 1 || im.height() < 1) throw new Error('image has no size')
  console.log('imge', im)

  im.detectObject(model, {}, function(err, matches) {
    if (err) {
      console.error("Error:", err)
      throw err
    }
    console.log('matches', matches)

    if (matches.length > 0) {
      for (var i = 0; i < matches.length; i++) {
        var match = matches[i]

        var matchBoundingBox = [
          match.x,
          match.y,
          match.x + match.width /2,
          match.y + match.height /2
        ]
        console.log('matchBoundingBox', matchBoundingBox)

        im.ellipse(match.x + match.width / 2,
                   match.y + match.height / 2,
                   match.width / 2,
                   match.height / 2)
        console.log(match)
        // do backup save for debugging
        im.save("./tmp/ped" + Date.now() + ".jpg")
      }
    }
  })
}


/*
var matToJson = new stream.Transform({
  transform: function peopleTrans_Transform(buf, encoding, callback) {
    this.push(buf)
    callback()
  },
  flush: function peopleTrans_Flush(callback) {
    callback()
  }
})
*/
