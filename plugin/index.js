

const { Plugin,  StreamSpeechResult } = require("@fonoster/common");
const { Stream, Transform } = require("stream");
const PluginResult = require("./pluginResult");
const SpeechProcessor = require("./speechProcessor");
const AudioProcessor = require("./audioProcessor");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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
      let s = new PluginResult();
      console.log("streamTranscribe callied")
      // stream.on("data", (data) => {
      //   console.log("data received")
      //   console.log(data)
      //   s.emit({ transcript: "Hello World", isFinal: true });
      // })
      // stream.on("end", () => {
      //   console.log("end received")
      //   s.emit({ transcript: "Hello World", isFinal: true });
      // })
      // stream.on("error", (error) => {
      //   console.log("error received")
      //   s.emit({ transcript: "Hello World", isFinal: true });
      // })

      new SpeechProcessor(
        stream,
        async (transcript, isFinal) => {
          s.emit({ transcript, isFinal });
        },
        (result) => {
          // We are not yet doing diarization
        }
      );

        return s;
    }

    async transcribe(stream) {
      console.log("transcribe called")
      // console.log(stream)

      const random = Math.random()

      await sleep(5*Math.random()*1000)

      if (random > 0.8) {
        return Promise.resolve({
          transcript: "||AI Warning||",
          isFinal: true
        });
      }

      return Promise.resolve({
          transcript: "Hello World",
          isFinal: true
      });
    }

}


module.exports = MyPlugin;
