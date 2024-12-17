require("dotenv").config();

const express = require("express");
const { connectDB } = require("./config/db.config");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

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
