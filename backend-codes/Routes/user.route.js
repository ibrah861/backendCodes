const express = require("express");

// create user routes
const router = express.Router();

// routes path
const {
  userAccount,
  signIn,
  allusers,
  oneUser,
  currentUser,
} = require("../controller/user.conroller");
const { authMiddleWare } = require("../middleware/auth");
const { Role } = require("../middleware/userRole");
const {
  creteBlog,
  blogPost,
  getOneBlog,
  deleteBlog,
  updateBlog,
} = require("../controller/blog.controller");

const upload = require("../multer/multer");

// auth Routes
router.route("/signup").post(userAccount);
router.route("/signin").post(signIn);

// get user Routes
router.route("/alluser").get(authMiddleWare, Role("admin"), allusers);
router.route("/me").get(authMiddleWare, Role("admin", "user"), currentUser);
router.route("/user/:id").get(authMiddleWare, Role("admin", "user"), oneUser);

// get blog post Routes
router
  .route("/post")
  .post(authMiddleWare, Role("admin", "user"), upload, creteBlog);
router.route("/post").get(authMiddleWare, Role("admin", "user"), blogPost);
router
  .route("/post/:id")
  .get(authMiddleWare, Role("admin", "user"), getOneBlog);
router
  .route("/post/:id")
  .delete(authMiddleWare, Role("admin", "user"), deleteBlog);
router
  .route("/update/:id")
  .put(authMiddleWare, Role("admin", "user"), upload, updateBlog);

module.exports = router;
