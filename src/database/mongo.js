const { MongoMemoryServer } = require("mongodb-memory-server");
const { MongoClient } = require("mongodb");

let database = null;

async function startDatabase(parms) {
  const mongo = new MongoMemoryServer();
  console.log("mongp=" + mongo);
  const mongoDBURL = await mongo.getConnectionString();
  console.log("url=" + mongoDBURL);
  const connection = await MongoClient.connect(mongoDBURL, {
    useNewUrlParser: true,
  });
  database = connection.db();
}

async function getDatabase() {
  if (!database) await startDatabase();
  return database;
}

module.exports = {
  getDatabase,
  startDatabase,
};
