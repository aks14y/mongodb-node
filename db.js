const { MongoClient } = require("mongodb");

let dbConnection;
let uri =
  "mongodb+srv://akshay4362847:<password>@nodebeginner.wh5tq21.mongodb.net/?retryWrites=true&w=majority&appName=NodeBeginner";

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db();
        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
