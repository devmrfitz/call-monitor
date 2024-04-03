const { VoiceServer } = require("@fonoster/voice");
const MyPlugin = require("./plugin");

const serverConfig = {
  pathToFiles: `${process.cwd()}/sounds`,
};

const voiceServer = new VoiceServer(serverConfig);

voiceServer.use(new MyPlugin())

voiceServer.listen(
  async (req, res) => {
    console.log(req);
    await res.answer();

    // const speech = await res.gather();
    // console.log("User input: " + speech);
      const stream = await res.sgather({source: "dtmf,speech"});

      stream.on("transcript", (text, isFinal) => {
         console.log("transcript: %s", text);
      })

      stream.on("dtmf", digit => {
         console.log("digit: " + digit);
         if (digit === "#") stream.close();
      })
    // await res.use(new GoogleTTS());
    // await res.say("Hello, welcome to Fonoster!");
    console.log('starting')
    // const result = await res.record({maxDuration: 1, finishOnKey: "#"});
    console.log('stopping')
    // console.log(JSON.stringify(result))
    await res.play(`sound:${req.selfEndpoint}/sounds/sample3.sln`);
    await res.hangup();
    },
  3000
);
