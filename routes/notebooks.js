const express = require("express");
const router = express.Router();
const Notebook = require("../models/Notebook");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const notebooks = await Notebook.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(notebooks);
  } catch (error) {
    console.error("Fetch notebooks error:", error);
    res.status(500).json({ message: "Failed to fetch notebooks" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { name, icon, color, isSecured, pin } = req.body;

  if (!name)
    return res.status(400).json({ message: "Notebook name is required" });

  try {
    const existing = await Notebook.findOne({ name, user: req.user.id });
    if (existing) {
      return res
        .status(400)
        .json({ message: `Notebook with name '${name}' already exists` });
    }

    const newNotebook = new Notebook({
      name,
      user: req.user.id,
      icon,
      color,
      isSecured,
      pin,
    });

    await newNotebook.save();
    res.status(201).json(newNotebook);
  } catch (error) {
    console.error("Create notebook error:", error);
    res.status(500).json({ message: "Failed to create notebook" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const notebook = await Notebook.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notebook) {
      return res
        .status(404)
        .json({ message: "Notebook not found or unauthorized" });
    }

    res.json({ message: "Notebook deleted successfully" });
  } catch (error) {
    console.error("Delete notebook error:", error);
    res.status(500).json({ message: "Failed to delete notebook" });
  }
});

module.exports = router;
