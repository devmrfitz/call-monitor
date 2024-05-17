/*
 * Copyright (C) 2023 by Fonoster Inc (https://fonoster.com)
 * http://github.com/fonoster/fonoster
 *
 * This file is part of Fonoster
 *
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 *
 *    https://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ServerConfig } from "./types";
import { posix } from "path";
import { Plugin } from "@fonoster/common";
import { serveFiles } from "./utils";
import { getLogger } from "@fonoster/logger";
import VoiceResponse from "./voice";
import express from "express";
import PubSub from "pubsub-js";
import os from "os";

const merge = require("deepmerge");
const app = express();
app.use(express.json());
require("express-ws")(app);

const logger = getLogger({ service: "voice", filePath: __filename });

const defaultServerConfig: ServerConfig = {
  base: "/",
  port: 3000,
  bind: "0.0.0.0",
  pathToFiles: os.tmpdir()
};

export default class VoiceServer {
  config: ServerConfig;
  plugins: {};
  constructor(config: ServerConfig = defaultServerConfig) {
    this.config = merge(defaultServerConfig, config);
    this.init();
    this.plugins = {};
  }

  /**
   * Add tts or asr plugin.
   *
   * @param plugin
   */
  use(plugin: Plugin) {
    // Note: We only support registering one plugin per type
    this.plugins[plugin.getType()] = plugin;
  }

  listen(handler: Function, port = this.config.port) {
    app.get(posix.join(this.config.base, "/sounds/:file"), (req, res) =>
      serveFiles(this.config)(req, res)
    );

    // Alias path for sounds
    app.get(posix.join(this.config.base, "/tts/:file"), (req, res) =>
      serveFiles(this.config)(req, res)
    );

    app.get("/ping", (req, res) => {
      res.send("pong");
    });

    app.post(posix.join(this.config.base), async (req, res) => {
      const response = new VoiceResponse(req.body);
      response.plugins = this.plugins;
      handler(req.body, response);
      res.end();
    });

    logger.info(
      `starting voice server @ ${this.config.bind}, port=${this.config.port}, path=${this.config.base}`
    );

    app.listen(port, this.config.bind);
  }

  init() {
    logger.info("initializing voice server");
    (app as any).ws(this.config.base, (ws) => {
      ws.on("message", (msg: string) => {
        if (Buffer.isBuffer(msg)) {
          // Session ids will always be 12 or 13 digits long)
          const numDigits = 2;
          const idLength = parseInt(msg.toString("utf-8", 0, numDigits));
          const sessionId = msg.toString("utf-8", 2, idLength + numDigits);
          const mediaData = msg.slice(idLength + numDigits);
          PubSub.publish(`ReceivingMedia.${sessionId}`, mediaData);
        } else {
          const event = JSON.parse(msg);

          if (event.error) {
            logger.error("received new event from the dispatcher", event);
            return;
          }

          if (event.type === "PlaybackFinished") {
            PubSub.publish(`${event.type}.${event.data.playbackId}`, event);
          } else if (
            event.type === "RecordingFinished" ||
            event.type === "RecordingFailed"
          ) {
            PubSub.publish(`${event.type}.${event.data.name}`, event);
          } else {
            PubSub.publish(`${event.type}.${event.sessionId}`, event);
          }
        }
      }).on("error", console.error);
    });
  }
}
