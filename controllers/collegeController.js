const mongoose = require('mongoose');
const { College, Counselling } = require('../models/schema');

// Test Route
exports.apiTest = (req, res) => {
  res.send('College API is working');
};

// Create a college and increment Counselling numberOfColleges
exports.createCollege = async (req, res) => {
  const { name, code, city, state, type, counsellingId, university,availableBranches, isAutonomous } = req.body;

  if (!mongoose.Types.ObjectId.isValid(counsellingId)) {
    return res.status(400).json({ error: 'Invalid counselling ID' });
  }

  try {
    const college = await College.create({
      name,
      code,
      city,
      state,
      type,
      counsellingId,
      university,
      availableBranches, // ✅ NEW FIELD
      isAutonomous
    });

    await Counselling.findByIdAndUpdate(counsellingId, {
      $inc: { numberOfColleges: 1 }
    });

    res.status(201).json({ message: 'College created successfully', college });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create college', details: err.message });
  }
};

// Get all colleges
// exports.readAllColleges = async (req, res) => {
//   try {
//     const colleges = await College.find().populate('counsellingId', 'name exam year');
//     res.json({ message: 'Colleges retrieved successfully', colleges });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to retrieve colleges', details: err.message });
//   }
// };

// Get college by ID
exports.readCollegeById = async (req, res) => {
  const { _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: 'Invalid college ID format' });
  }

  try {
    const college = await College.findById(_id).populate('counsellingId', 'name exam');
    if (!college) return res.status(404).json({ message: 'College not found' });

    res.json({ message: 'College retrieved successfully', college });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve college', details: err.message });
  }
};

// Get college by name (case-insensitive)
exports.readCollegeByName = async (req, res) => {
  const { name } = req.params;
  
  try {
    const colleges = await College.find({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
      .populate('counsellingId', 'name exam');

      res.render('readColleges', { colleges });
    if (!colleges) {
      return res.status(404).json({ message: 'College not found with given name' });
    }

    // res.json({ message: 'College retrieved successfully', colleges });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve college', details: err.message });
  }
};


// Update college
exports.updateCollege = async (req, res) => {
  const { _id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: 'Invalid college ID format' });
  }

  try {
    const updated = await College.findByIdAndUpdate(_id, updates, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.json({ message: 'College updated successfully', college: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update college', details: err.message });
  }
};

// Delete college and decrement Counselling numberOfColleges
exports.deleteCollege = async (req, res) => {
  const { _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: 'Invalid college ID format' });
  }

  try {
    const college = await College.findByIdAndDelete(_id);

    if (!college) {
      return res.status(404).json({ error: 'College not found' });
    }

    await Counselling.findByIdAndUpdate(college.counsellingId, {
      $inc: { numberOfColleges: -1 }
    });

    res.json({ message: 'College deleted successfully', deleted: college });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete college', details: err.message });
  }
};
