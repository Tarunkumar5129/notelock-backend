const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const Section = require("../models/Section");

router.get("/:notebookId", verifyToken, async (req, res) => {
  try {
    const sections = await Section.find({
      notebook: req.params.notebookId,
      user: req.user.id,
    });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sections" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, notebook } = req.body;

    const section = new Section({
      name,
      notebook,
      user: req.user.id,
    });

    await section.save();
    res.status(201).json(section);
  } catch (err) {
    console.error(" Failed to create section:", err);
    res.status(500).json({ error: "Failed to create section" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Section.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Section deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete section" });
  }
});

module.exports = router;
