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
    // console.log(JSON.stringify(result))
    res.play(`sound:${req.selfEndpoint}/sounds/sample3.sln`);
    // await res.hangup();
    },
  4000
);
