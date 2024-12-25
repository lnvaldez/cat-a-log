const { User } = require("../models");

const protect = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const user = await User.findById(req.session.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized" });
  }
};

module.exports = { protect };
