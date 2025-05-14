const mongoose = require("mongoose");

const NotebookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    icon: { type: String },
    color: { type: String },
    isSecured: { type: Boolean, default: false },
    pin: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notebook", NotebookSchema);
