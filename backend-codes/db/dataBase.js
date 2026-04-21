const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dataBase = () => {
  try {
    const dataBase = mongoose
      .connect(process.env.MONGO_URI_ATLUS)

      .then(() => {
        console.log("Data base connected");
      })
      .catch((err) => {
        console.log("Failed to connect dataBase" + err);
      });
  } catch (err) {
    console.log(err);
  }
};

dataBase();

module.exports = dataBase;
