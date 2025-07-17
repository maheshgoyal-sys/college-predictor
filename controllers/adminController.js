const { Admin } = require("../models/schema");
const bcrypt=require('bcrypt');
const jwt = require('jsonwebtoken');

// GET /admin/api
exports.apiTest = (req, res) => {
  res.send("Admin API is working");
};


// POST /admin/register
exports.registerAdmin = async (req, res) => {
  const { name, email, username, password, role } = req.body;

  try {
    // Check if username already exists
    const existingUser = await Admin.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username already exists" });

    // Check if email already exists
    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) return res.status(400).json({ error: "Email already exists" });

    // Hash the password using async/await
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const newAdmin = await Admin.create({
      name,
      email,
      username,
      password: hashedPassword,
      role,
    });

    // Generate JWT token
    const token = jwt.sign({ email: email,id:newAdmin._id,role:newAdmin.role}, "key" ,{ expiresIn: "1h" }); // use env in prod
    res.cookie("token", token);

    res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ error: "Failed to register admin", details: err.message });
  }
};

// POST /admin/login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "Register first" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Update last login
    admin.lastLoginAt = new Date();
    await admin.save();

    // Generate and send JWT token
    const token = jwt.sign({ email: admin.email,role:admin.role,id:admin._id}, "key"); // Use env in production
    res.cookie("token", token);

    res.json({ message: "Login successful", admin });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
};

// GET /admin/me
exports.getProfile = async (req, res) => {
  const { username } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: "Profile not found" });

    res.json({ message: "Admin profile", admin });
  } catch (err) {
    res.status(500).json({ error: "Failed to get profile", details: err.message });
  }
};

// GET /admin/all
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    if (admins.length === 0) return res.json({ message: "No admins found" });

    res.json({ admins });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admins", details: err.message });
  }
};

// DELETE /admin/delete/:username
exports.deleteAdmin = async (req, res) => {
  const { username } = req.params;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    await Admin.deleteOne({ username });
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete admin", details: err.message });
  }
};
