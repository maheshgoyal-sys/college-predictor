// const mongoose = require('mongoose');

// require('dotenv').config();
// // const uri = process.env.MONGO_URI;

// // mongoose.connect(`${uri}`)
// // mongoose.connect('mongodb://localhost/test')
// // .then(() => console.log("Connected to MongoDB"))
// // .catch(err => console.error("MongoDB connection error:", err));

// // Admin Panel Schema
// const adminSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true, lowercase: true },
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true }, // Should be hashed in real use
//   role: { type: String, enum: ['superadmin', 'admin','moderator'], default: 'moderator' },
//   createdAt: { type: Date, default: Date.now },
//   lastLoginAt: { type: Date },
//   lastLogoutAt: { type: Date }
// });

// // Student Schema
// const studentSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true },
//   password: { type: String, required: true }, // Should be hashed in real use
//   phone: { type: String, required: true, match: /^[6-9]\d{9}$/ },
//   exam: { type: String, enum: ['JEE Main', 'JEE Advanced', 'CUET', 'WBJEE'], required: true },
//   rank: { type: Number, required: true },
//   category: { type: String, enum: ['GEN', 'EWS', 'OBC', 'SC', 'ST'], required: true },
//   homeState: { type: String, required: true },
//   gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
//   isActive: { type: Boolean, default: true }, // Ensures soft delete logic
//   lastLoginAt: { type: Date },
//   lastLogoutAt: { type: Date }
// }, { timestamps: true });

// // Counselling Schema
// const counsellingSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   year: { type: Number, required: true },
//   exam: { type: String, required: true },
//   description: {type :String},
//   numberOfColleges: { type: Number, default: 0 }, // NEW FIELD
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date,default:Date.now} 
// }, { timestamps: true });

// // College Schema
// const collegeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   code: { type: String, required: true },
//   city: String,
//   state: String,
//   type: { type: String, enum: ['IIT', 'NIT', 'IIIT', 'GFTI', 'Private'], required: true },
//   counsellingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselling', required: true },
//   university: String,
//   isAutonomous: Boolean,
//   availableBranches: [{ type: String }]  // ✅ NEW FIELD
// }, { timestamps: true });

// // Branch Schema
// const branchSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   code: { type: String, required: true },
//   degree: { type: String, enum: ['B.Tech', 'B.E', 'B.Arch', 'B.Plan'], required: true },
//   duration: { type: Number, default: 4 }
// }, { timestamps: true });

// // Cutoff Schema
// const cutoffSchema = new mongoose.Schema({
//   counsellingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselling', required: true },
//   year: { type: Number, required: true },
//   round: { type: Number, required: true },
//   collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
//   branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
//   category: { type: String, enum: ['GEN', 'EWS', 'OBC', 'SC', 'ST'], required: true },
//   quota: { type: String, enum: ['AI', 'HS', 'OS', 'GO'], required: true },
//   seatType: { type: String, enum: ['Gender-Neutral', 'Female-Only'], required: true },
//   openingRank: Number,
//   closingRank: Number
// }, { timestamps: true });

// cutoffSchema.index({ counsellingId: 1, year: 1, round: 1, category: 1, quota: 1 });

// // Prediction Schema
// const predictionSchema = new mongoose.Schema({
//   studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//   counsellingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselling', required: true },
//   predictionDate: { type: Date, default: Date.now },
//   predictedColleges: [{
//     collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
//     branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
//     round: Number,
//     category: String,
//     quota: String,
//     seatType: String,
//     closingRank: Number,
//     predictedChance: Number
//   }]
// }, { timestamps: true });

// // (Rest of the file remains unchanged...)
// // Append adminSchema to module exports
// module.exports = {
//   Student: mongoose.model('Student', studentSchema),
//   Counselling: mongoose.model('Counselling', counsellingSchema),
//   College: mongoose.model('College', collegeSchema),
//   Branch: mongoose.model('Branch', branchSchema),
//   Cutoff: mongoose.model('Cutoff', cutoffSchema),
//   Prediction: mongoose.model('Prediction', predictionSchema),
//   Admin: mongoose.model('Admin', adminSchema),
 
// };


