const {Stream} = require("stream");

class PluginResult /*implements StreamSpeechResult*/ {
  stream;

  constructor() {
    this.stream = new Stream();
  }



  close() {
    this.stream.removeAllListeners();
  }

  on(event, callback) {
    if (event === "transcript") {
      this.stream.on("data", (data) => {
        return {
            transcript: "Hello World",
            isFinal: true
        }
      });
    }

    if (event === "error") {
      this.stream.on("error", (error) => {
        return {
            transcript: "Hello World2",
            isFinal: true
        }
      });
    }
  }

  emit(data) {
    this.stream.emit("data", data);
  }
}

module.exports = PluginResult;
