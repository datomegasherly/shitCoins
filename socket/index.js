const express = require("express");
const app = express();
const router = express.Router();
const CHANNELS = require("./channels");
const WebSocket = require("ws");
const Socket = require("./socket");
const { wsPort, wSocket } = require("../config");

router.use("/game/:name", (req, res) => {
  /*const socket = new Socket();
  const name = req.params.name.toString().toUpperCase();
  if (CHANNELS[name]) {
    socket.subscribe(name);
  }*/
  res.send("ss");
});

router.use("/publish/:name", (req, res) => {
  const ws = new WebSocket(`${wSocket}:${wsPort}/`);
  ws.on("message", ({ data }) => {
    console.log(data);
  });
  ws.on("connection", () => {
    isConnected = true;
  });
  const socket = new Socket(ws);
  const name = req.params.name.toString().toUpperCase();
  if (CHANNELS[name]) {
    socket.broadCast({
      channel: name,
      message: { test: 1 },
    });
  }
  res.send("ok");
});

module.exports = router;
