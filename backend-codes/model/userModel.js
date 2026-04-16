const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// user Schema || owner of blogs
const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    refreshtoken: [
      {
        type: String,
        require: true,
      },
    ],
  },
  { timestamps: true },
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
