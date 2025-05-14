const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
console.log("auth.js routes loaded");

router.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials!" });

    const token = jwt.sign(
      { userId: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/biometric/register", async (req, res) => {
  const { userName, email } = req.body;

  try {
    const challenge = crypto.randomBytes(32).toString("base64");

    await User.updateOne(
      { userName },
      { email },
      { $set: { biometricChallenge: challenge } },
      { upsert: true }
    );

    const publicKey = {
      challenge,
      rp: { name: "NoteLock" },
      user: {
        id: Buffer.from(email).toString("base64"),
        name: email,
        displayName: email,
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },
        { type: "public-key", alg: -257 },
      ],
      timeout: 60000,
      attestation: "direct",
    };

    console.log("PublicKey object being sent:", publicKey);
    res.json(publicKey);
  } catch (err) {
    console.error("Biometric Registration Error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/biometric/verify", async (req, res) => {
  const { email, id, rawId, type, response } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    console.log("Received rawId:", rawId);

    user.credentialId = rawId;
    await user.save();

    res.status(200).json({ message: "Biometric credential saved!" });
  } catch (err) {
    console.error("Biometric Save Error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/biometric/get-credential-id", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.credentialId) {
      return res
        .status(404)
        .json({ message: "No biometric data found for this user" });
    }

    res.json({ credentialId: user.credentialId });
  } catch (error) {
    console.error("Get Credential ID Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/biometric/login", async (req, res) => {
  const { email, credentialId } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.credentialId) {
      return res.status(400).json({ message: "Biometric credential mismatch" });
    }

    if (user.credentialId !== credentialId) {
      return res.status(400).json({ message: "Biometric credential mismatch" });
    }

    const token = jwt.sign(
      { userId: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error("Biometric Login Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.get("/test", (req, res) => {
  res.send("Auth routes working!");
});

module.exports = router;
