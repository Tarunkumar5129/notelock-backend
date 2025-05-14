const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const notebookRoutes = require("./routes/notebooks");
const sectionRoutes = require("./routes/sections");
const pageRoutes = require("./routes/pages");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/notebooks", notebookRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/pages", pageRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
