const { User } = require("../models");

const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    req.session.userId = user._id;
    res.status(201).json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user._id;
    res.json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  req.session = null;
  res.json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };
