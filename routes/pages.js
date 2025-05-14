const express = require("express");
const router = express.Router();
const Page = require("../models/Page");
const verifyToken = require("../middleware/authMiddleware");

router.get("/:sectionId", verifyToken, async (req, res) => {
  try {
    const pages = await Page.find({
      section: req.params.sectionId,
      user: req.user.id,
    });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pages" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, content, section, notebook } = req.body;

    const page = new Page({
      name,
      content,
      section,
      notebook,
      user: req.user.id,
    });

    await page.save();
    res.status(201).json(page);
  } catch (err) {
    res.status(500).json({ error: "Failed to create page" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;

    const page = await Page.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { content: content },
      { new: true }
    );

    res.json(page);
  } catch (err) {
    console.error("Failed to update page:", err);
    res.status(500).json({ error: "Failed to update page" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Page.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: "Page deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete page" });
  }
});

module.exports = router;
