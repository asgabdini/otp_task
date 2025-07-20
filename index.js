require("dotenv").config();
const express = require("express");
const app = express();

const swaggerSetup = require("./swagger");

const authRoutes = require("./routes/auth");
const connectDB = require("./db");

app.use(express.json());

app.use("/auth", authRoutes);

swaggerSetup(app);

connectDB()
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.SERVER_PORT, () =>
      console.log(`Server started on port ${process.env.SERVER_PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
