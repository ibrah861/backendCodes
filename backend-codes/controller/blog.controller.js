const blogModel = require("../model/blogModel");
const cloudinary = require("../multer/cloudinary");
const path = require("path");

const creteBlog = async (req, res) => {
  const { title, subtitle, content } = req.body;

  // check if details is filed
  try {
    // check if all field is not empty
    const unfield = title === "" || subtitle === "" || content === "";
    if (unfield) {
      res.status(401).json({ msg: "All field is required" });
    }

    // check if contents is repeated
    const blog = await blogModel.findOne({ title });

    // if title exist
    if (blog) {
      res.status(401).json({ msg: "blog alredy exist" });
    }

    // if does not exist
    if (!blog) {
      const cloudImg = await cloudinary.uploader.upload(req.file.path);
      const create = await blogModel.create({
        title,
        subtitle,
        content,
        Image: cloudImg.secure_url,
        ImageId: cloudImg.public_id,
        author: req.userId,
      });
      res
        .status(201)
        .json({ msg: "blog created success", isblogCreated: true });
    }
  } catch (err) {
    res.status(401).json({ msg: `"failed to create blog ${err}` });
  }
};

const blogPost = async (req, res) => {
  // find post
  const getBlog = await blogModel.find().populate({ path: "author" });

  //  if threre is no post
  if (getBlog.length === 0) {
    res.status(401).json({ msg: "No blog record found ! " });
  }

  //  if there is
  if (getBlog) {
    res.status(201).json({ msg: "all blog found", getBlog });
  }
};

const getOneBlog = async (req, res) => {
  const userId = req.userId._id;
  try {
    // find post
    const onePost = await blogModel.find({ author: userId });

    if (onePost.length === 0) {
      res.status(201).json({ msg: "No blog found !", onePost });
    } else {
      res.status(201).json({ msg: "all blog found !", onePost });
    }
  } catch (err) {
    res.status(401).json({ msg: "failed to find blog" });
  }
};

const deleteBlog = async (req, res) => {
  const userId = req.userId._id;
  try {
    // find post AND delete into mongo
    const onePost = await blogModel.findOneAndDelete({ author: userId });
    // delete into cloudinary

    res.status(201).json({ msg: "one blog deleted !", isDelete: true });
  } catch (err) {
    res.status(401).json({ msg: `failed to delete ${err}` });
  }
};

// const updateBlog = () => {};

module.exports = { creteBlog, blogPost, getOneBlog, deleteBlog };
