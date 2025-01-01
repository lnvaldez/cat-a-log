require("dotenv").config();

const express = require("express");
const { connectDB } = require("./config/db.config");
const linkRoutes = require("./routes/link.routes");
const commentRoutes = require("./routes/comment.routes");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:4200",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// Routes (without protect middleware)
app.use("/api/links", linkRoutes);
app.use("/api/comments", commentRoutes);

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
