const express=require('express');
const app=express();
const mongoose=require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const userModel = require('./models/register');
// const adminRoutes = require('./routes/admin.js'); // adjust path
// const studentRoutes= require('./routes/students.js'); // adjust path
// const counsellingRoutes = require('./routes/counselling.js'); // adjust path
// const collegeRoutes = require('./routes/colleges.js'); // adjust path
// const branchRoutes = require('./routes/branch.js'); // adjust path
// const cutoffRoutes = require('./routes/cutoffs.js'); // adjust path
// const predictRoutes = require('./routes/predict.js'); // adjust path
// // ❌ Missing line
// const College = require('./models/college');
// const Student = require('./models/student');
// const Branch = require('./models/branch');
// const Cutoff = require('./models/cutoff');
const College = require('./models/college');
const mainCollege = require('./models/maincollege');
const Contact = require('./models/contact');
const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            req.isAuthenticated = false;
            req.user = null;
            return next(); // Proceed without authentication
        }

        jwt.verify(token, "swfwcfwc", (err, decoded) => {
            if (err) {
                req.isAuthenticated = false;
                req.user = null;
                res.clearCookie('token'); // Clear invalid token
                return next();
            }
            req.isAuthenticated = true;
            req.user = decoded; // Decoded should contain { email: 'user@example.com' }
            next();
        });
    } catch (err) {
        req.isAuthenticated = false;
        req.user = null;
        res.clearCookie('token');
        next();
    }
};
app.get('/',auth,(req,res)=>{
    res.render("index", { isAuthenticated: req.isAuthenticated, userName: req.user ? req.user.email : null });
  
})
app.get('/about', auth, function(req, res) {
    res.render('about', { isAuthenticated: req.isAuthenticated, userName: req.user ? req.user.email : null });
});
app.get('/contact', auth, function(req, res) {
    res.render('contact', { isAuthenticated: req.isAuthenticated, userName: req.user ? req.user.email : null });
});
app.get('/privacy-policy', auth, function(req, res) {
    res.render('privacy-policy', { isAuthenticated: req.isAuthenticated, userName: req.user ? req.user.email : null });
});


app.get('/terms-and-conditions', auth, function(req, res) {
    res.render('terms-and-conditions', { isAuthenticated: req.isAuthenticated, userName: req.user ? req.user.email : null });
});
app.get('/predict',auth,function(req,res){
     if (!req.isAuthenticated) {
        return res.redirect('/login');
    }
    res.render('predict', { isAuthenticated: req.isAuthenticated, userName: req.user ? req.user.email : null });
})
app.get('/colleges/read',async (req,res)=>{
  const name = req.query.name;

  try {
    const college = await College.findOne({ name: name });

    if (!college) {
      return res.status(404).send("College not found");
    }

        res.render('readColleges', { college, isAuthenticated: req.isAuthenticated, userName: req.user ? req.user.email : null });
   
  } catch (err) {
    console.error("❌ Error fetching college details:", err);
    res.status(500).send("Server Error");
  }
})
app.post('/colleges/read', async (req, res) => {
  const name = req.body.name?.trim();

  try {
    const colleges = await College.find({
      name: { $regex: name, $options: 'i' }
    });

    // Add fileName field for image lookup
    const updatedColleges = colleges.map(college => {
      // Log full college object
      console.log("Full college object:", college);

      // Extract name safely
      const resolvedName = college.name || (college._doc && college._doc.name);

      console.log("Resolved name:", resolvedName);

      return {
        ...college.toObject(),
        fileName: resolvedName
          ? resolvedName.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
          : 'default'
      };
    });

        res.render('readColleges', { colleges: updatedColleges, isAuthenticated: req.isAuthenticated, userName: req.user ? req.user.email : null });

  } catch (error) {
    console.error("❌ Error fetching colleges:", error.message);
    res.render('readColleges', { colleges: [] });
  }
});
// app.post('/predict', async (req, res) => {
//   try {
//     const { rank, category, gender, counselling, homeState, pwd } = req.body;

//     const categoryMap = {
//       'GEN': 'OPEN',
//       'OBC-NCL': 'OBC-NCL',
//       'SC': 'SC',
//       'ST': 'ST'
//     };

//     const resolvedCategory = categoryMap[category];
//     const finalCategory = pwd ? `${resolvedCategory}-PwD` : resolvedCategory;

//     const genderList = gender === 'Female'
//   ? ['Gender-Neutral', 'Female-only (including Supernumerary)']
//   : ['Gender-Neutral'];


//     const numericRank = parseInt(rank);
//     let quotaValues;

// if (counselling === 'JoSAA') {
//   quotaValues = ['HS', 'OS']; // JoSAA does not use 'AI'
// } else if (counselling === 'CSAB') {
//   quotaValues = ['AI', 'HS', 'OS']; // CSAB uses 'AI'
// } else {
//   quotaValues = ['HS', 'OS']; // default fallback
// }


// const queryConditions = {
//   category: finalCategory,
//   gender: { $in: genderList },
//   quota: { $in: quotaValues },
//   year: 2024,
//   openingRank: { $lte: numericRank },
//   closingRank: { $gte: numericRank }
// };


//     console.log("✅ Final Query Conditions:", queryConditions);
//     console.log("🔍 Query Conditions:", JSON.stringify(queryConditions, null, 2));
    
//     const testDoc = await College.findOne({});
// console.log("📌 One College Doc:", testDoc);
// const collections = await mongoose.connection.db.listCollections().toArray();
// console.log("📂 Available Collections:", collections.map(c => c.name));
//   const test1 = await mainCollege.find({ category: "OPEN-PwD" });
// console.log("Found OPEN-PwD entries:", test1.length);


//     // let colleges = await College.find(queryConditions).lean();
// let colleges = await mainCollege.find({
//   category: finalCategory, // e.g. 'OPEN', 'OBC-NCL', 'SC', 'ST', etc.
//   gender: { $in: genderList }, // ['Gender-Neutral'] or ['Gender-Neutral', 'Female-only (including Supernumerary)']
//   quota: { $in: quotaValues }, // ['AI', 'HS', 'OS'] ya ['HS', 'OS']
//   year: 2024,
//   openingRank: { $lte: numericRank }, // e.g. 8042
//   closingRank: { $gte: numericRank }
// });

// console.log("🧪 Test Hardcoded Match:", colleges);

//     console.log("📊 Found Colleges:", colleges.length);

//     console.log("📦 Fetched from DB:", colleges.length);

//     // JoSAA home state filter logic
// if (counselling === 'JoSAA') {
//   colleges = colleges.filter(clg => {
//     if (clg.quota === 'HS') return clg.state === homeState;
//     if (clg.quota === 'OS') return clg.state !== homeState;
//     return false; // filter out others like AI (shouldn't be there anyway)
//   });
// }

// console.log("📤 After JoSAA Home State filter:", colleges.length);



//     // Sort results
//     colleges.sort((a, b) => a.openingRank - b.openingRank);

//     res.json(colleges.slice(0, 50));
//   } catch (err) {
//     console.error('❌ Prediction Error:', err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });
app.get('/register',(req,res)=>{
    res.render("register", { isAuthenticated: req.isAuthenticated, userName: req.user ? req.user.email : null });
 
})
app.post('/register', (req,res)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(req.body.password,salt,async (err,hash)=>{
        let createdUser = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: hash
});
    let token = jwt.sign({email : req.body.email},"swfwcfwc");
    res.cookie("token",token);
    //ek ack user created
    res.redirect("predict");
        })
    })
   
});
app.get('/login',(req,res)=>{
    res.render("login", { isAuthenticated: req.isAuthenticated, userName: req.user ? req.user.email : null });
  
});
app.post('/login',async (req,res)=>{
    let user = await userModel.findOne({email : req.body.email});
    if(!user) return res.send("Something is wrong");

    bcrypt.compare(req.body.password,user.password,(err,result)=>{
        if(result){
          let token = jwt.sign({ email: user.email }, "swfwcfwc");
                res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); 
        res.redirect("/predict");
        }
        else
        res.send("Something went wrong");
    })
});
app.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the authentication token cookie
    res.redirect('/'); // Redirect to the home page or login page
});
app.get('/contact',(req,res)=>{
  res.render("contact");
})
app.post('/contact', async (req, res) => {
  try {
    const { name, mobile, email, subject, message } = req.body;

    const newMessage = new Contact({
      name,
      mobile,
      email,
      subject,
      message
    });

    await newMessage.save();

    res.send(`
      <script>
        alert("✅ Your message has been saved to the database!");
        window.location.href = "/contact";
      </script>
    `);
  } catch (err) {
    console.error("❌ Error saving message:", err);
    res.send(`
      <script>
        alert("❌ Error saving message to database.");
        window.location.href = "/contact";
      </script>
    `);
  }
});
// app.use('/admin',adminRoutes); // Use the admin routes

// app.use('/branch', branchRoutes); // Use the branch routes

// app.use('/colleges', collegeRoutes); // Use the college routes

// app.use('/counselling', counsellingRoutes); // Use the counselling routes

// app.use('/cutoffs', cutoffRoutes); // Use the cutoff routes

// app.use('/predict', predictRoutes); // Use the predict routes

// app.use('/students',studentRoutes); // Use the student routes



app.listen(port,()=>{
    console.log(`Server is running..`);
})