const {Transform} = require("stream");

class SpeechProcessor {
  stream;

  constructor(stream) {
    this.stream = stream
    this.audioInputStreamTransform = new Transform({
      transform: (chunk, encoding, callback) => {
        this.transformer(chunk, encoding, callback);
      }
    });
    stream.pipe(this.audioInputStreamTransform)
    console.log("Stream piped")
  }


  transformer(chunk, encoding, callback) {
    console.log("transformer called")
    console.log(chunk)
    callback(null, chunk);
  }
}
module.exports = SpeechProcessor;
