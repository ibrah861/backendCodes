const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const dataBase = () => {
  try {
    const dataBase = mongoose
      .connect(
        "mongodb+srv://ibra200fc:ErpMhhvFA7AiSPWy@cluster0.o7ce8md.mongodb.net/?appName=Cluster0",
      )

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
