const { response } = require("express");
const mongoose = require("mongoose");
const fetch = require("axios");
const got = require("got");
const { curly } = require("node-libcurl");
const { smartAPI } = require("./config");

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
      launchdate: mongoose.Schema.Types.String,
      description: mongoose.Schema.Types.String,
      link: mongoose.Schema.Types.String,
    });
    this.model = mongoose.model("Coin", schema);
  }
  async create(data) {
    const Coin = this.model;
    const prevData = await Coin.findOneAndUpdate(
      { contract: data.contract },
      {
        name: data.name,
        date: data.date,
        launchdate: data.launchdate,
        description: data.description,
        link: data.link,
      }
    );
    if (!prevData) {
      await Coin.create(data);
      return true;
      /*return await fetch(
        `https://api.bscscan.com/api?module=contract&action=getabi&address=${data.contract}&apikey=3ZTMKUPTJ9VVF34R4EXGYPJHNA2RWZCGNT`
      ).then(async (response) => {
        if (response.data.status == 1) {
          await Coin.create(data);
          return true;
        } else {
          return false;
        }
      });*/
    } else {
      return true;
    }
  }
  async contract(cont) {
    const { statusCode, data, headers } = await curly.get(`${smartAPI}${cont}`);
    return data[0] ? `${data[0].name} (${data[0].symbol})` : "";
    /*curlTest.on("end", function (statusCode, data, headers) {
      return data[0] ? `${data[0].name} (${data[0].symbol})` : "";
    });*/
    /*try {
    return await fetch(`https://api1.poocoin.app/tokens?search=${cont}`, {
      method: "GET",
      mode: "no-cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => {
        return data[0] ? `${data[0].name} (${data[0].symbol})` : "";
      });
    } catch (err) {
      return "";
    }*/
  }
  async delete() {
    const Coin = this.model;
    await Coin.deleteMany({});
  }
  async getOne(contract) {
    const Coin = this.model;
    return await Coin.find({ contract });
  }
  async get(search = "") {
    const Coin = this.model;
    if (search === "") {
      return await Coin.find().sort({ date: "asc" });
    } else {
      return await Coin.find({
        $or: [
          {
            name: { $regex: ".*" + search + ".*", $options: "i" },
          },
          {
            contract: { $regex: ".*" + search + ".*", $options: "i" },
          },
          {
            description: { $regex: ".*" + search + ".*", $options: "i" },
          },
        ],
      }).sort({ date: "asc" });
    }
  }
}

module.exports = Coin;
