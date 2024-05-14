const { VoiceServer } = require("@fonoster/voice");
const MyPlugin = require("./plugin");
const SayPlugin = require("./sayPlugin");
const {record} = require("./record");

const serverConfig = {
  pathToFiles: `${process.cwd()}/sounds`,
};



const voiceServer = new VoiceServer(serverConfig);

voiceServer.use(new MyPlugin())
// voiceServer.use(new SayPlugin())

voiceServer.listen(
  async (req, res) => {
    console.log(req);
    console.log("Answering call")
    await res.answer();
    res.use(new SayPlugin())


    while (true) {
      const speech = await res.gather();
      // console.log("User input: " + speech);
      if (speech === "||AI Warning||")
        await res.say("Warning! AI detected");
      else
        await res.play(`sound:${req.selfEndpoint}/sounds/hello-world.sln16`);
    }



    // const stream = await res.sgather({source: "dtmf,speech"});
    // //
    // stream.on("transcript", (text, isFinal) => {
    //      console.log("transcript: %s", text);
    //      res.play(`sound:${req.selfEndpoint}/sounds/hello-world.sln16`);
    //   })
    //
    // stream.on("dtmf", digit => {
    //      console.log("digit: " + digit);
    //      if (digit === "#") stream.close();
    //   })
    // // await res.use(new GoogleTTS());
    //   res.say("Hello, welcome to Fonoster!");
    // console.log('starting')
    // // const result = await res.record({maxDuration: 1, finishOnKey: "#"});
    // console.log('stopping')
    // console.log(JSON.stringify(result))
    //   const result = await (new SayPlugin()).synthesize("a")
    // res.play(`sound:${req.selfEndpoint}/tts/${result.filename}`);
    // let curr = 0
    // while (true) {
    //   await record(`${process.cwd()}/sounds/${curr}.wav16`, 1000)
    //    res.play(`sound:${req.selfEndpoint}/sounds/${curr}.wav16`);
    //   curr = 1 - curr
    //
    //
    // }
    // res.play(`sound:${req.selfEndpoint}/sounds/0.wav16`);
    // await sleep(900);
    // await res.play(`sound:${req.selfEndpoint}/sounds/hello-world.sln16`);
    // await res.hangup();
    // const dialStream = await res.dial("916375039639")
    },
  3000
);
