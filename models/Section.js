const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    notebook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
