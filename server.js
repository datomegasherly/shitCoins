const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const { wsPort } = require("./config");
const Socket = require("./socket/socket");
const CHANNELS = require("./socket/channels");

const clients = new Map();

const server = new WebSocket.Server({ port: wsPort });

server.on("connection", function connection(ws) {
  const id = uuidv4();
  const socket = new Socket(ws);
  const metadata = { id };
  clients.set(ws, metadata);
  ws.on("message", function message(data) {
    data = JSON.parse(data.toString());
    if (data && data.channel && CHANNELS[data.channel]) {
      const message = data;
      const metadata = clients.get(ws);
      socket.subscribe(data.channel);
    } else if (data && data.message) {
      return data.message;
    }
  });
});

console.log("WebSocket server started at ws://locahost:" + wsPort);
