const { Branch } = require('../models/schema');
const bcrypt=require('bcrypt');
//  Test route
exports.apiTest = (req, res) => {
  res.send("Branch API is working");
};

//  Create a new branch
exports.createBranch = async (req, res) => {
  const { name, code, degree, duration } = req.body;

  try {
    // Check for duplicate name or code
    const existingName = await Branch.findOne({ name });
    const existingCode = await Branch.findOne({ code });

    if (existingName) {
      return res.status(400).json({ error: "Branch name already exists" });
    }
    if (existingCode) {
      return res.status(400).json({ error: "Branch code already exists" });
    }

    const newBranch = await Branch.create({ name, code, degree, duration });

    res.status(201).json({
      message: "Branch created successfully",
      branch: newBranch
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create branch", details: err.message });
  }
};

//  Get all branches
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });
    res.json({ message: "Branches retrieved successfully", branches });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch branches", details: err.message });
  }
};

//  Get branch by ID
exports.getBranchById = async (req, res) => {
  const { _id } = req.params;

  try {
    const branch = await Branch.findById(_id);
    if (!branch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.json({ message: "Branch found", branch });
  } catch (err) {
    res.status(500).json({ error: "Failed to get branch", details: err.message });
  }
};

//  Update branch
exports.updateBranch = async (req, res) => {
  const { _id } = req.params;
  const updates = req.body;

  try {
    const updatedBranch = await Branch.findByIdAndUpdate(_id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedBranch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.json({ message: "Branch updated", branch: updatedBranch });
  } catch (err) {
    res.status(500).json({ error: "Failed to update branch", details: err.message });
  }
};

//  Delete branch
exports.deleteBranch = async (req, res) => {
  const { _id } = req.params;

  try {
    const deletedBranch = await Branch.findByIdAndDelete(_id);
    if (!deletedBranch) {
      return res.status(404).json({ error: "Branch not found" });
    }

    res.json({ message: "Branch deleted successfully", branch: deletedBranch });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete branch", details: err.message });
  }
};
