const jwt = require("jsonwebtoken");

const authMiddleWare = async (req, res, next) => {
  // verify jwt tokens form client
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  const token = authHeader && authHeader?.split(" ")[1];

  // if token is undefined
  if (token === undefined) {
    res.status(403).json({ msg: "Token is required" });
  }

  // if there is no token
  if (!token) {
    res.status(403).json({ msg: "Token expired" });
  }

  // if token is exist
  try {
    jwt.verify(token, process.env.ACCESS_TOKENS, (err, decoded) => {
      if (err) {
        res.status(406).json({ msg: "Invalied token" });
      }
      if (decoded) {
        req.userId = decoded;
        next();
      }
    });
  } catch (err) {
    return;
  }
};

// LOGOUT USER
const logout = (req, res) => {
  // clear refreshtoken in front end
  res.clearCookie("jwt_token", "", {
    httpOnly: true,
    sucure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });

  const token = "";

  return res.status(400).json({ msg: "Loggedout success", token });

  // clear refreshtoken in db
};

module.exports = { authMiddleWare, logout };
