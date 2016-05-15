var stream = require('stream')
var debug = require('debug')('dcped:detector')

const model = 'node_modules/opencv/data/haarcascade_upperbody.xml'

function gotMat(mat, encoding, callback) {
  var self = this;
  if (mat.width() < 1 || mat.height() < 1) throw new Error('image has no size')
  debug('image', mat)

  mat.detectObject(model, {}, function(err, matches) {
    debug('matches', matches)
    if (err) {
      console.error("Error:", err)
      throw err
    }

    if (matches.length > 0) {
      self.push(JSON.stringify(matches))
      for (var i = 0; i < matches.length; i++) {
        var match = matches[i]

        debug(match)

        mat.ellipse(match.x + match.width / 2,
                   match.y + match.height / 2,
                   match.width / 2,
                   match.height / 2)

        // do backup save for debugging
        mat.save("./tmp/ped" + Date.now() + ".jpg")
        callback()
      }
    } else {
      callback()
    }
  })
}

function Detector() {
  return new stream.Transform({
    transform: gotMat,
    flush: function detectorFlush(callback) {
      callback()
    },
    objectMode: true
  })
}

module.exports = Detector
