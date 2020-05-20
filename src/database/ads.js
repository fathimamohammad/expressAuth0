const { getDatabase } = require("./mongo");
const { ObjectID } = require("mongodb");

const collectionsName = "ads";

async function insertAd(ad) {
  console.log("inserting:" + JSON.stringify(ad));
  const database = await getDatabase();
  const { insertId } = await database.collection(collectionsName).insertOne(ad);
  return insertId;
}

async function getAds() {
  const database = await getDatabase();
  return await database.collection(collectionsName).find({}).toArray();
}

async function deleteAd(id) {
  const database = await getDatabase();
  await database.collection(collectionsName).deleteOne({
    _id: new ObjectID(id),
  });
}

async function updateAd(id, ad) {
  const database = await getDatabase();
  delete ad._id;
  await database.collection(collectionsName).update(
    { _id: new ObjectID(id) },
    {
      $set: {
        ...ad,
      },
    }
  );
}

module.exports = {
  insertAd,
  getAds,
  deleteAd,
  updateAd,
};
