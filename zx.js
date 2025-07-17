app.post('/create',async function(req,res){
    const newStudent=await Student.create({
        name:req.body.name,
        email:req.body.Email,
        phone:req.body.phone,
        exam:req.body.exam,
        rank:req.body.rank,
        category:req.body.category,
        homeState:req.body.homeState,
        gender:req.body.gender
    });
    // Assuming you want to send the created student back as a response
    res.send(newStudent);
});






app.get('/read',async function(req,res){
    const students=await Student.find();
    res.send(students);
});




// router.post('/admin/register',async function(req,res){
//     const newAdmin= await Admin.create({
//         username:req.body.username,
//         password:req.body.password,
//     }).then(admin => {  
//         res.status(201).json({
//             message: 'Admin registered successfully',
//             admin: admin
//         });
//     }).catch(error => {
//         res.status(500).json({
//             message: 'Error registering admin',
//             error: error
//         });
//     });
// })








collegeSchema.post('save', async function(doc, next) {
  try {
    await mongoose.model('Counselling').findByIdAndUpdate(
      doc.counsellingId,
      { $inc: { numberOfColleges: 1 } }
    );
    next();
  } catch (err) {
    next(err);
  }
});


// Auto-increment numberOfColleges on College creation
collegeSchema.post('save', async function(doc, next) {
  try {
    await mongoose.model('Counselling').findByIdAndUpdate(
      doc.counsellingId,
      { $inc: { numberOfColleges: 1 } }
    );
    next();
  } catch (err) {
    next(err);
  }
});