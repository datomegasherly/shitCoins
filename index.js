const express = require("express");
const bodyParser = require("body-parser");
const Coin = require("./coin");
const { toChecksumAddress } = require("ethereum-checksum-address");
const { pass } = require("./config");

const port = 8020;

const coin = new Coin();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/scripts"));
app.set("view engine", "pug");

const countDays = (t) => {
  var cd = 24 * 60 * 60 * 1000,
    ch = 60 * 60 * 1000,
    d = Math.floor(t / cd),
    h = Math.floor((t - d * cd) / ch),
    m = Math.round((t - d * cd - h * ch) / 60000),
    pad = function (n) {
      return n < 10 ? "0" + n : n;
    };
  if (m === 60) {
    h++;
    m = 0;
  }
  if (h === 24) {
    d++;
    h = 0;
  }
  return `${d} Days - ${pad(h)} Hours - ${pad(m)} Minutes`;
};

const getImage = (contract) => {
  try {
    return `https://r.poocoin.app/smartchain/assets/${toChecksumAddress(
      contract
    )}/logo.png`;
  } catch (err) {
    return false;
  }
};

app.get("/", async (req, res) => {
  const data = await coin.get();
  res.render("list", { data, countDays, getImage });
});
app.get("/search/:search", async (req, res) => {
  const search = req.params.search
    ? req.params.search.replace(/[\W+]/g, "")
    : "";
  const data = await coin.get(search);
  res.render("list", { data, countDays, search, getImage });
});

app.post("/checkContract", async (req, res) => {
  const cont = req.body.contract;
  if (cont) {
    const contract = await coin.contract(cont);
    return res.json(contract);
  } else {
    return res.json({});
  }
});

app.get("/create", (req, res) => {
  res.render("create", { isPost: {} });
});
app.get("/create/:id", async (req, res) => {
  const id = req.params.id.replace(/[\W+]/g, "");
  const data = await coin.getOne(id);
  res.render("create", { isPost: {}, data: data[0] ? data[0] : {} });
});
app.get("/delete", (req, res) => {
  console.log(res.body);
  //coin.delete()
});

/*app.get("/deleteAll", (req, res) => {
  coin.delete();
  res.render("create", { isPost: {} });
});*/
app.post("/create", async (req, res) => {
  if (req.body.name === "") {
    res.render("create", { isPost: { error: true }, data: req.body });
    return;
  }
  if (req.body.contract === "") {
    res.render("create", { isPost: { error: true }, data: req.body });
    return;
  }
  if (req.body.date === "") {
    res.render("create", { isPost: { error: true }, data: req.body });
    return;
  }
  if (pass.indexOf(req.body.code) < 0) {
    res.render("create", { isPost: { error: true }, data: req.body });
    return;
  }
  const c = await coin.create({
    name: req.body.name,
    contract: req.body.contract,
    date: req.body.date,
    description: req.body.description,
    link: req.body.link,
  });
  if (c) {
    res.render("create", { isPost: { success: true } });
  } else {
    res.render("create", { isPost: { error: true }, data: req.body });
  }
});

app.listen(port, () => {
  console.log(`The app is started on port ${port}`);
});
