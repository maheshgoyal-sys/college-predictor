const { Student } = require("../models/schema");
const mongoose = require("mongoose");

// GET test
exports.apiTest = (req, res) => {
  res.send("Student API is working");
};

// POST /register
exports.registerStudent = async (req, res) => {
  const { name, email, phone, password, exam, rank, category, homeState, gender } = req.body;

  try {
    const existingPhone = await Student.findOne({ phone });
    if (existingPhone) return res.status(409).json({ error: "Phone already registered" });

    const existingEmail = await Student.findOne({ email });
    if (existingEmail) return res.status(409).json({ error: "Email already registered" });

    const newStudent = await Student.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password, // Hash in production
      exam,
      rank,
      category,
      homeState,
      gender
    });

    res.status(201).json({ message: "Student registered successfully", student: newStudent });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /login
exports.loginStudent = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const student = await Student.findOne({ phone, isActive: true });
    if (!student) return res.status(404).json({ error: "Register first" });

    if (student.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    student.lastLoginAt = new Date();
    await student.save();

    res.json({ message: "Login successful", student });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /:_id
exports.getStudentById = async (req, res) => {
  const { _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "Invalid student ID format" });
  }

  try {
    const student = await Student.findOne({ _id, isActive: true });
    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json({ student });
  } catch (err) {
    console.error("Get Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT /:_id
exports.updateStudent = async (req, res) => {
  const { _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "Invalid student ID format" });
  }

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      _id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) return res.status(404).json({ error: "Student not found" });

    res.json({ message: "Student updated successfully", student: updatedStudent });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE /:_id
exports.deleteStudent = async (req, res) => {
  const { _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ error: "Invalid student ID format" });
  }

  try {
    const student = await Student.findByIdAndUpdate(
      _id,
      { isActive: false },
      { new: true }
    );

    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json({ message: "Student soft-deleted successfully", student });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
