const express = require("express");

// create user routes
const router = express.Router();

// routes path
const {
  userAccount,
  signIn,
  allusers,
  oneUser,
} = require("../controller/user.conroller");
const { authMiddleWare, logout } = require("../middleware/auth");
const { Role } = require("../middleware/userRole");
const {
  creteBlog,
  blogPost,
  getOneBlog,
  deleteBlog,
} = require("../controller/blog.controller");

const upload = require("../multer/multer");

// auth Routes
router.route("/signup").post(userAccount);
router.route("/signin").post(signIn);

// get user Routes
router.route("/users").get(authMiddleWare, Role("admin"), allusers);
router.route("/user").get(authMiddleWare, Role("admin", "user"), oneUser);

// get blog post Routes
router
  .route("/post")
  .post(authMiddleWare, Role("admin", "user"), upload, creteBlog);
router.route("/post").get(authMiddleWare, Role("admin", "user"), blogPost);
router
  .route("/postuser")
  .get(authMiddleWare, Role("admin", "user"), getOneBlog);
router
  .route("/delete")
  .delete(authMiddleWare, Role("admin", "user"), deleteBlog);

// logout Routes
router.route("/logout").post(logout);

module.exports = router;
