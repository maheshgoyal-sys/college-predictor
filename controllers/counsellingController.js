const { Counselling } = require("../models/schema");
const mongoose = require("mongoose");

// Test Route
exports.apiTest = (req, res) => {
  res.send("Counselling API is working");
};

// Create new counselling
exports.createCounselling = async (req, res) => {
  const { name, year, exam, description } = req.body;

  try {
    const exists = await Counselling.findOne({ name });
    if (exists) return res.status(409).json({ message: "Counselling already exists" });

    const newEntry = await Counselling.create({
      name,
      year,
      exam,
      description
    });

    res.status(201).json({
      message: "Counselling created successfully",
      data: newEntry
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create counselling", details: err.message });
  }
};

// Read all counselling
exports.readAllCounselling = async (req, res) => {
  try {
    const entries = await Counselling.find().sort({ name: 1 });
    res.status(200).json({ message: "Counselling read successfully", data: entries });
  } catch (err) {
    res.status(500).json({ error: "Failed to read counselling", details: err.message });
  }
};

// Get counselling by ID
exports.readCounsellingById = async (req, res) => {
  const { _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "Invalid counselling ID format" });
  }

  try {
    const entry = await Counselling.findById(_id);
    if (!entry) return res.status(404).json({ message: "Counselling not found" });

    res.status(200).json({ message: "Counselling read successfully", data: entry });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counselling", details: err.message });
  }
};

// Update counselling
exports.updateCounselling = async (req, res) => {
  const { _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "Invalid counselling ID format" });
  }

  try {
    const updated = await Counselling.findByIdAndUpdate(
      _id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Counselling record not found" });
    }

    res.status(200).json({
      message: "Counselling updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update counselling", details: err.message });
  }
};

// Delete counselling
exports.deleteCounselling = async (req, res) => {
  const { _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "Invalid counselling ID format" });
  }

  try {
    const deleted = await Counselling.findByIdAndDelete(_id);
    if (!deleted) return res.status(404).json({ error: "Counselling not found" });

    res.status(200).json({ message: "Counselling deleted successfully", deletedData: deleted });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete counselling", details: err.message });
  }
};
