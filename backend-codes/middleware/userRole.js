const Role = (...alloweRole) => {
  return (req, res, next) => {
    if (!alloweRole.includes(req.userId.role)) {
      return res.status(401).json({ msg: "Access denide" });
    }
    next();
  };
};

// export Role
module.exports = { Role };
