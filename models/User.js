const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  credentialId: { type: String },
  biometricChallenge: { type: String },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
