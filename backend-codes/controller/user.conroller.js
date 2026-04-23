const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// POST REQUEST

// create user Account
const userAccount = async (req, res) => {
  const { fullname, email, password, role } = req.body;

  // check if user exist in db
  const existingUser = await userModel.findOne({ email }).exec();

  // if exist
  if (existingUser) {
    return res.status(409).json({
      success: true,
      msg: "User alredy exist",
      head: "Error",
      isAuth: false,
    });
  }

  // hashing password
  const salt = await bcrypt.genSalt(12);
  const hashedPsw = await bcrypt.hash(password, salt);

  // if does not exist
  if (!existingUser) {
    const newUser = await userModel.create({
      fullname,
      email,
      password: hashedPsw,
      role,
    });
    return res.status(201).json({
      success: true,
      details: newUser,
      head: "Success",
      msg: "Account created",
      isAuth: true,
    });
  }
};

// Signin in user Account
const signIn = async (req, res) => {
  const { fullname, email, password } = req.body;

  // check if user exist in db
  const existingUser = await userModel.findOne({ email });

  // if user does not exist
  if (!existingUser) {
    return res.status(401).json({
      success: true,
      msg: "Invalid credential",
      head: "Error",
      isAuth: false,
    });
  }

  // if exist
  if (existingUser) {
    // check psw is correct
    const matchPsw = await bcrypt.compare(password, existingUser.password);

    // if psw Match doent match
    if (!matchPsw) {
      return res.status(403).json({
        success: true,
        msg: "Incorrect password  ",
        head: "Error",
        isAuth: false,
      });
    }

    if (matchPsw) {
      // payload
      const payload = existingUser._doc;
      const { _id, role } = payload;

      // generate access token
      const accesstoken = jwt.sign({ _id, role }, process.env.ACCESS_TOKENS, {
        expiresIn: "7d",
      });

      // generate refreshtoken
      const refreshToken = jwt.sign({ _id, role }, process.env.REFRESH_TOKENS, {
        expiresIn: "7m",
      });

      existingUser.refreshtoken = refreshToken;
      await existingUser.save();

      return res.cookie("jwt_token", refreshToken, {
        httpOnly: true,
        sucure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      });

      return res.status(200).json({
        success: true,
        msg: "Loggedin success ",
        head: "Success",
        token: accesstoken,
        isAuth: true,
        role,
        user: existingUser,
      });
    }
  }
};

// GET REQUEST
const allusers = async (req, res) => {
  // find all user
  const users = await userModel.find();

  if (!users) {
    return res.status(401).json({ msg: "No user records available" });
  }
  if (users) {
    return res.status(201).json({ success: true, users });
  }
};

const oneUser = async (req, res) => {
  // find one user

  const user = await userModel.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ msg: "User not Found" });
  }
  if (user) {
    return res.status(201).json({ success: true, user });
  }
};

const currentUser = async (req, res) => {
  const me = await userModel.findById(req.userId._id);
  if (!me) {
    return res.status(404).json({ message: "User not Found", isUser: false });
  }
  // if user available
  if (me) {
    return res
      .status(201)
      .json({ message: "User available", isUser: true, user: me });
  }
};

module.exports = { userAccount, signIn, allusers, oneUser, currentUser };
