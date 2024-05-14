const { Transform } = require("stream");
const logger = require("@fonoster/logger");

const emptyBuffer = Buffer.alloc(640, 0);

class AudioProcessor {
  constructor(socket, transcriptCallback, resultsCallback) {
    this.request = {
      n: null,
      interimResults: false
    };
    this.recognizeStream = null;
    this.restartCounter = 0;
    this.audioInput = [];
    this.lastAudioInput = [];
    this.resultEndTime = 0;
    this.isFinalEndTime = 0;
    this.finalRequestEndTime = 0;
    this.newStream = true;
    this.bridgingOffset = 0;
    this.lastTranscriptWasFinal = false;
    this.streamingLimit = 290000; // 4.8 minutes

    this.audioInputStreamTransform = new Transform({
      transform: (chunk, encoding, callback) => {
        this.transformer(chunk, encoding, callback);
      }
    });

    this.transcriptCallback = transcriptCallback;
    this.resultsCallback = resultsCallback;
    this.startStream();
    this.socket = socket;
    // socket.pipe(this.audioInputStreamTransform);

    socket.on("data", (data) => {
      console.log("data received")
      this.audioInputStreamTransform.write(data)
    })

    setInterval(() => {
      if (this.recognizeStream) {
        this.recognizeStream.write(emptyBuffer);
      }
    }, 5000);
  }

  startStream() {
    // Clear current audioInput
    this.audioInput = [];

    this.cb = (stream) => {
      const results = this.speechCallback(stream);
      if (this.transcriptCallback && results[0] && results[0].alternatives[0]) {
        this.transcriptCallback(
          results[0].alternatives[0].transcript.trimStart(),
          results[0].isFinal
        );
      }

      if (this.resultsCallback) {
        this.resultsCallback(results);
      }
    };

    // Restart stream when streamingLimit expires
    this.currentTimer = setTimeout(() => {
      this.restartStream();
    }, this.streamingLimit);

    // Initiate (Reinitiate) a recognize stream
    // this.recognizeStream = this.speechClient
    //   .streamingRecognize(this.request)
    //   .on("error", (err) => {
    //     if (err.code === 11) {
    //       // this.restartStream();
    //     } else {
    //       // If we get any errors we restart the stream.
    //       // This will tipically happen if no audio is sent for
    //       // a period if 10 seconds.
    //       this.restartStream();
    //       logger.silly(err);
    //     }
    //   })
    //   .on("data", this.cb);
  }

  speechCallback(stream) {
    this.resultEndTime =
      stream.results[0].resultEndTime.seconds * 1000 +
      Math.round(stream.results[0].resultEndTime.nanos / 1000000);

    if (stream.results[0].isFinal) {
      this.isFinalEndTime = this.resultEndTime;
      this.lastTranscriptWasFinal = true;
    } else {
      this.lastTranscriptWasFinal = false;
    }
    return stream.results;
  }

  /*
   * The transformer accumulates and keeps track
   * of the audio chunks to make sure we don't lose anything
   * when we restart the stream.
   */
  transformer(chunk, encoding, callback) {
    // WARNING: This synchronization logic is causing the class
    // to send repeated streams inmediatly after restarting the
    // recognition.
    /*if (this.newStream && this.lastAudioInput.length !== 0) {
      // Approximate math to calculate time of chunks
      const chunkTime = this.streamingLimit / this.lastAudioInput.length;
      if (chunkTime !== 0) {
        if (this.bridgingOffset < 0) {
          this.bridgingOffset = 0;
        }
        if (this.bridgingOffset > this.finalRequestEndTime) {
          this.bridgingOffset = this.finalRequestEndTime;
        }
        const chunksFromMS = Math.floor(
          (this.finalRequestEndTime - this.bridgingOffset) / chunkTime
        );
        this.bridgingOffset = Math.floor(
          (this.lastAudioInput.length - chunksFromMS) * chunkTime
        );
        for (let i = chunksFromMS; i < this.lastAudioInput.length; i++) {
          this.recognizeStream.write(this.lastAudioInput[i]);
        }
      }
      this.newStream = false;
    }
    this.audioInput.push(chunk);*/

    console.log("transformer called")

    if (this.recognizeStream) {
      this.recognizeStream.write(chunk);
    }

    callback();
  }

  restartStream() {
    this.stop();

    if (this.resultEndTime > 0) {
      this.finalRequestEndTime = this.isFinalEndTime;
    }
    this.resultEndTime = 0;
    this.lastAudioInput = [];
    this.lastAudioInput = this.audioInput;

    this.restartCounter++;

    logger.silly(
      `${this.streamingLimit * this.restartCounter}: RESTARTING REQUEST\n`
    );

    this.newStream = true;
    this.startStream();
  }

  stop() {
    logger.silly("destroying stream recognize");
    if (this.recognizeStream) {
      this.recognizeStream.end();
      this.recognizeStream.removeListener("data", this.cb);
      this.recognizeStream = null;
    }
  }
}

module.exports = AudioProcessor;
