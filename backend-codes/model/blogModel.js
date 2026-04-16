const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// blog Schema of user || owner
const blogSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    subtitle: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    Image: {
      type: String,
    },
    ImageId: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: false,
    },
  },
  { timestamps: true },
);

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;
