const mongoose = require("mongoose");

class Coin {
  constructor() {
    this.connect();
    this.models();
  }
  async connect() {
    this.db = await mongoose.connect("mongodb://localhost:27017/coin", {
      useNewUrlParser: true,
    });
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });
  }
  models() {
    const schema = new mongoose.Schema({
      name: mongoose.Schema.Types.String,
      contract: mongoose.Schema.Types.String,
      date: mongoose.Schema.Types.String,
      description: mongoose.Schema.Types.String,
    });
    this.model = mongoose.model("Coin", schema);
  }
  async create(data) {
    const Coin = this.model;
    const prevData = await Coin.findOneAndUpdate(
      { contract: data.contract },
      { name: data.name, date: data.date, description: data.description }
    );
    if (!prevData) {
      await Coin.create(data);
    }
  }
  async delete() {
    const Coin = this.model;
    await Coin.deleteMany({});
  }
  async get() {
    const Coin = this.model;
    return await Coin.find().sort({ date: "asc" });
  }
}

module.exports = Coin;
