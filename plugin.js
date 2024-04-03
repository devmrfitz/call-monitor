

const { Plugin,  StreamSpeechResult } = require("@fonoster/common");
const { Stream } = require("stream");

class MyPlugin extends Plugin {
  constructor() {
    super("asr", "myplugin");
  }
  createSpeechTracker(options) {
    return new PluginTracker();
  }
}

class PluginTracker {
    streamTranscribe(stream) {
        return new PluginResult()
    }

    transcribe(stream) {
        return Promise.resolve({
            transcript: "Hello World",
            isFinal: true
        });
    }

}

class PluginResult {
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

module.exports = MyPlugin;
