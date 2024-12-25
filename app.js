require("dotenv").config();

const express = require("express");
const { connectDB } = require("./config/db.config");
const authRoutes = require("./routes/auth.routes");
const linkRoutes = require("./routes/link.routes");
const commentRoutes = require("./routes/comment.routes");
const cookieSession = require("cookie-session");
const { protect } = require("./middleware/auth.middleware");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/links", protect, linkRoutes);
app.use("/api/comments", protect, commentRoutes);

const startApp = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start app: ", error.message);
    process.exit(1);
  }
};

startApp();
