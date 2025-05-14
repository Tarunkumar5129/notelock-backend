const mongoose = require("mongoose");
const { Schema } = mongoose;

const pageSchema = new Schema({
  name: { type: String, required: true },
  content: { type: Schema.Types.Mixed },
  section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
  notebook: { type: mongoose.Schema.Types.ObjectId, ref: "Notebook" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Page", pageSchema);
