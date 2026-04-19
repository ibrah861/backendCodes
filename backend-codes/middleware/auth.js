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

module.exports = { authMiddleWare };
