const {copyFileSync} = require("node:fs");
const { Plugin,  StreamSpeechResult } = require("@fonoster/common");

class SayPlugin extends Plugin {
  constructor() {
    super("tts", "googletts");
  }
  async synthesize(text, options={}) {
    console.log(`Synthesizing speech for ${text}`)
    return {
        filename: "warning.sln",
        pathToFile: "/Users/adityapratapsingh/Workspace/projects/call-monitor/sounds/warning.sln",
      };
  }


  async synthesizeSpeech(
    text,
    options,
    filename,
    pathToFile,
  ) {
    console.log(`Synthesizing speech for ${text}`)
    const curr = "/Users/adityapratapsingh/Workspace/projects/call-monitor/sounds/file_example_MP3_700KB.mp3"
    // copy file to pathToFile
    await copyFileSync(curr, pathToFile);
    console.log(`File copied to ${pathToFile}`)
    return {
      filename: filename,
      pathToFile: pathToFile,
    }
  }

}

module.exports = SayPlugin;
