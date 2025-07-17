const { Cutoff } = require('../models/schema');

// Test route
exports.apiTest = (req, res) => {
  res.send("Cutoff API is working");
};

// Create new cutoff
exports.createCutoff = async (req, res) => {
  try {
    const newCutoff = await Cutoff.create(req.body);
    res.status(201).json({ message: "Cutoff record added", cutoff: newCutoff });
  } catch (err) {
    res.status(500).json({ error: "Failed to add cutoff", details: err.message });
  }
};

// Get all cutoffs with optional filters
exports.getAllCutoffs = async (req, res) => {
  const { counsellingId, year, round, category, quota, collegeId, branchId } = req.query;

  const filter = {};
  if (counsellingId) filter.counsellingId = counsellingId;
  if (year) filter.year = year;
  if (round) filter.round = round;
  if (category) filter.category = category;
  if (quota) filter.quota = quota;
  if (collegeId) filter.collegeId = collegeId;
  if (branchId) filter.branchId = branchId;

  try {
    const cutoffs = await Cutoff.find(filter)
      .populate('collegeId branchId counsellingId')
      .sort({ year: -1, round: 1 });
    res.json({ message: "Cutoff records fetched", cutoffs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cutoff records", details: err.message });
  }
};

// Get cutoff by ID
exports.getCutoffById = async (req, res) => {
  const { id } = req.params;

  try {
    const cutoff = await Cutoff.findById(id)
      .populate('collegeId branchId counsellingId');

    if (!cutoff) {
      return res.status(404).json({ error: "Cutoff not found" });
    }

    res.json({ message: "Cutoff record found", cutoff });
  } catch (err) {
    res.status(500).json({ error: "Failed to get cutoff", details: err.message });
  }
};

// Update cutoff by ID
exports.updateCutoff = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedCutoff = await Cutoff.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedCutoff) {
      return res.status(404).json({ error: "Cutoff record not found" });
    }

    res.json({ message: "Cutoff updated", cutoff: updatedCutoff });
  } catch (err) {
    res.status(500).json({ error: "Failed to update cutoff", details: err.message });
  }
};

// Delete cutoff by ID
exports.deleteCutoff = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCutoff = await Cutoff.findByIdAndDelete(id);

    if (!deletedCutoff) {
      return res.status(404).json({ error: "Cutoff not found" });
    }

    res.json({ message: "Cutoff deleted", cutoff: deletedCutoff });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete cutoff", details: err.message });
  }
};
