const AudioRecorder = require('node-audiorecorder')
const {createWriteStream} = require("node:fs");
const {join} = require("node:path");
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function record(filePath, duration) {
  let audioRecorder = new AudioRecorder({})

  const fileName = join(
  "/Users/adityapratapsingh/Workspace/projects/call-monitor/sounds",
  Math.random()
    .toString(36)
    .replace(/[^0-9a-zA-Z]+/g, '')
    .concat('.wav16')
  );

  console.log('Writing new recording file at:', fileName);

  // Create write stream.
  const fileStream = createWriteStream(filePath, { encoding: 'binary' });

  await audioRecorder.start()
  console.log('Recording started')
  audioRecorder.stream().pipe(fileStream)



  await sleep(duration)
  await audioRecorder.stop()
  console.log('Recording stopped')
}

module.exports = {record}
