const { Prediction } = require('../models/schema');
const {CollegeMode} = require('../models/schema');
const {BranchModel} = require('../models/schema');
const {Cutoff} = require('../models/schema');

// Test Route
exports.apiTest = (req, res) => {
  res.send("Prediction API is working");
};

// Create new prediction
exports.createPrediction = async (req, res) => {
  const { studentId, counsellingId, predictedColleges } = req.body;

  try {
    const newPrediction = await Prediction.create({
      studentId,
      counsellingId,
      predictedColleges
    });

    res.status(201).json({
      message: "Prediction created successfully",
      prediction: newPrediction
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create prediction", details: err.message });
  }
};

// Get predictions by studentId
exports.getPredictionsByStudentId = async (req, res) => {
  const { studentId } = req.params;

  try {
    const predictions = await Prediction.find({ studentId })
      .populate('studentId counsellingId predictedColleges.collegeId predictedColleges.branchId');

    if (!predictions.length) {
      return res.status(404).json({ error: "No predictions found for this student" });
    }

    res.json({ message: "Predictions fetched", predictions });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch predictions", details: err.message });
  }
};

// get predicted collges by comaparing
exports.predictedColleges = async function (req, res) {
  try {
    const {
      rank,
      category,
      gender,
      counselling,
      homeState,
      pwd,
      categoryRank
    } = req.body;

    // Rank to compare: General or Category Rank based on counselling
    const userRank = counselling === "JoSAA" ? (categoryRank || rank) : rank;

    // Query to find matching cutoffs
    const cutoffQuery = {
      counselling: counselling,
      category: category,
      gender: { $in: [gender, 'Gender-Neutral'] },
      isPWD: pwd || false,
      closingRank: { $gte: userRank }
    };

    // Include Home State quota logic (if applicable)
    if (homeState) {
      cutoffQuery.$or = [
        { homeStateQuota: homeState },
        { homeStateQuota: 'All India' } // or any default quota
      ];
    }

    const cutoffs = await Cutoff.find(cutoffQuery)
      .populate('college')
      .populate('branch')
      .sort({ closingRank: 1 });

    const result = cutoffs.map(cutoff => ({
      collegeName: cutoff.college.name,
      branchName: cutoff.branch.name,
      closingRank: cutoff.closingRank,
      openingRank: cutoff.openingRank,
      category: cutoff.category,
      gender: cutoff.gender,
      counselling: cutoff.counselling,
      round: cutoff.round
    }));

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });

    res.render('predicted')

  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// Delete a prediction (Admin access)
exports.deletePrediction = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Prediction.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Prediction not found" });
    }

    res.json({ message: "Prediction deleted", deleted });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete prediction", details: err.message });
  }
};
