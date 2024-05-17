# Call Monitor

Proof of concept of a pipeline to facilitate live monitoring calls using an SIP provider like Fonoster.

Exposes the call as a stream (in `plugin/speechProcessor.js`) without impacting it's natural flow or latency in any way. This stream can be passed to any [Synthetic Speech detection model](https://paperswithcode.com/task/synthetic-speech-detection) to guard against AI scams.
