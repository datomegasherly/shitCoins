const redis = require("redis");
const CHANNELS = require("./channels");
const { redisPass } = require("../config");

class Socket {
  constructor(ws) {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.publisher.auth(redisPass);
    this.subscriber.auth(redisPass);
    this.ws = ws;
    this.subscriber.on("message", (channel, message) => {
      console.log(message);
      this.ws.send(message);
    });
  }
  subscribe(channel) {
    if (CHANNELS[channel]) {
      this.subscriber.subscribe(channel);
      this.ws.send(JSON.stringify({ subscribed: true }));
    }
  }
  publish({ channel, message }) {
    if (CHANNELS[channel]) {
      this.publisher.publish(channel, message, () => {
        //this.subscriber.subscribe(channel);
      });
      /*this.subscriber.unsubscribe(channel, () => {
        this.publisher.publish(channel, message, () => {
          this.subscriber.subscribe(channel);
        });
      });*/
    }
  }
  broadCast({ channel, message }) {
    this.publish({
      channel,
      message: JSON.stringify(message),
    });
  }
}

module.exports = Socket;
