const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { startDatabase } = require("./database/mongo");
const { insertAd, getAds, deleteAd, updateAd } = require("./database/ads");

const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const app = express();

const ads = [{ title: "Hello node again" }];

app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

app.use(morgan("combined"));

app.get("/", async (req, res) => {
  res.send(await getAds());
});

const checkjwkt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-fat.au.auth0.com/.well-known/jwks.json`,
  }),
  audience: "https://fat-ads-api",
  issuer: "https://dev-fat.au.auth0.com",
  algorithms: ["RS256"],
});

app.use(checkjwkt);

app.post("/", async (req, res) => {
  const newAd = req.body;
  console.log("req body = " + JSON.stringify(req));
  await insertAd(newAd);
  res.send({ message: "New ad inserted" });
});

app.delete("/:id", async (req, res) => {
  await deleteAd(req.params.id);
  res.send({ message: "Ad removed" });
});

app.put("/:id", async (req, res) => {
  const updatedAd = req.body;
  await updateAd(req.params.id, updatedAd);
  res.send({ message: "ad updated" });
});

startDatabase().then(async () => {
  await insertAd({ title: "Hello, now from in-m,em db" });
});

app.listen(3001, () => {
  console.log("listening to port 3001");
});
