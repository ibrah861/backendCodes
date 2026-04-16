const mongoose = require("mongoose");

const dataBase = mongoose
  .connect("mongodb://localhost:27017/digital")

  .then(() => {
    console.log("Data base connected");
  })
  .catch((err) => {
    console.log("Failed to connect dataBase" + err);
  });

module.exports = dataBase;
