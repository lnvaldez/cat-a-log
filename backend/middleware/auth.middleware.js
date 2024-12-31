const { User } = require("../models");

const protect = async (req, res, next) => {
  try {
    // Check for session
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Get user
    const user = await User.findById(req.session.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Not authorized" });
  }
};

module.exports = { protect };
