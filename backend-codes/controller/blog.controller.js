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
      return res.status(401).json({ msg: "All field is required" });
    }

    // check if contents is repeated
    const blog = await blogModel.findOne({ title });

    // if title exist
    if (blog) {
      return res.status(401).json({ msg: "blog alredy exist" });
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
      return res
        .status(201)
        .json({ msg: "blog created success", isblogCreated: true });
    }
  } catch (err) {
    return res.status(401).json({ msg: `failed to create blog ${err}` });
  }
};

const blogPost = async (req, res) => {
  console.log(req.userId._id);
  // find post
  const getBlog = await blogModel
    .find({ author: req.userId._id })
    .populate({ path: "author" });

  //  if threre is no post
  if (getBlog.length === 0) {
    return res
      .status(404)
      .json({ msg: "No blog record found ! ", isPostAvailable: false });
  }

  //  if there is
  if (getBlog) {
    return res.status(201).json({ msg: "all blog found", getBlog });
  }
};

const getOneBlog = async (req, res) => {
  const userId = req.userId._id;
  try {
    // find post
    const onePost = await blogModel.findById(req.params.id);

    return res.status(201).json({ msg: "One blog found !", onePost });
  } catch (err) {
    return res.status(404).json({ msg: "failed to find blog" });
  }
};

const deleteBlog = async (req, res) => {
  const userId = req.userId._id;
  try {
    // find post AND delete into mongo
    const onePost = await blogModel.findByIdAndDelete(req.params.id);

    return res.status(201).json({ msg: "one blog deleted !", isDelete: true });
  } catch (err) {
    return res.status(404).json({ msg: `failed to delete ${err}` });
  }
};
const updateBlog = async (req, res) => {
  const { title, subtitle, content } = req.body;
  try {
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
    if (!blog) {
      // find post AND update into mongo
      const cloudImg = await cloudinary.uploader.upload(req.file.path);
      const onePost = await blogModel.findByIdAndUpdate(
        req.params.id,
        {
          title,
          subtitle,
          content,
          Image: cloudImg.secure_url,
          ImageId: cloudImg.public_id,
          author: req.userId,
        },
        { new: true },
      );

      res
        .status(201)
        .json({ msg: "one blog updated !", isUpdated: true, post: onePost });
    }
  } catch (err) {
    res.status(404).json({ msg: `failed to update ${err}` });
  }
};

module.exports = { creteBlog, blogPost, getOneBlog, deleteBlog, updateBlog };
