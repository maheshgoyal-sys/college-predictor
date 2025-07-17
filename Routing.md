#  College Predictor API – Routing Documentation

**Base URL:** `http://localhost:PORT`

---

##  Admin Routes

| Method | Endpoint                 | Description                     | Access      |
|--------|--------------------------|---------------------------------|-------------|
| POST   | /admin/register          | Register new admin              | Superadmin  |
| POST   | /admin/login             | Login and get token             | Public      |
| GET    | /admin/me                | Get logged-in admin profile     | Auth        |
| GET    | /admin/all               | List all admins                 | Superadmin  |
| DELETE | /admin/delete/:username | Delete admin by username        | Superadmin  |

---

##  Student Routes

| Method | Endpoint           | Description                             | Access |
|--------|--------------------|-----------------------------------------|--------|
| POST   | /student/register  | Register a new student                  | Public |
| POST   | /student/login     | Login as a student                      | Public |
| GET    | /student/:_id      | Get student profile by ID               | Auth   |
| PUT    | /student/:_id      | Update student details                  | Auth   |
| DELETE | /student/:_id      | Soft delete student (`isActive: false`) | Admin  |

---

##  Counselling Routes

| Method | Endpoint              | Description                        | Access |
|--------|-----------------------|------------------------------------|--------|
| POST   | /counselling/create   | Create new counselling session     | Admin  |
| GET    | /counselling/read     | Get all counselling sessions       | Public |
| GET    | /counselling/:_id     | Get counselling by ID              | Public |
| PUT    | /counselling/:_id     | Update counselling info            | Admin  |
| DELETE | /counselling/:_id     | Delete counselling                 | Admin  |

---

##  College Routes

| Method | Endpoint                  | Description                          | Access |
|--------|---------------------------|--------------------------------------|--------|
| POST   | /college/create           | Add new college                      | Admin  |
| GET    | /college/read             | Get all colleges                     | Public |
| GET    | /college/id/:_id          | Get college by ID                    | Public |
| GET    | /college/name/:name       | Get college by name                  | Public |
| PUT    | /college/:_id             | Update college info                  | Admin  |
| DELETE | /college/:_id             | Delete college                       | Admin  |

---

##  Branch Routes

| Method | Endpoint           | Description            | Access |
|--------|--------------------|------------------------|--------|
| POST   | /branch/create     | Add a new branch       | Admin  |
| GET    | /branch/read       | List all branches      | Public |
| GET    | /branch/:_id       | Get branch by ID       | Public |
| PUT    | /branch/:_id       | Update branch info     | Admin  |
| DELETE | /branch/:_id       | Delete a branch        | Admin  |

---

##  Cutoff Routes

| Method | Endpoint               | Description                           | Access |
|--------|------------------------|---------------------------------------|--------|
| POST   | /cutoff/addCutoff      | Add new cutoff                        | Admin  |
| GET    | /cutoff/cutoffs        | Get all cutoffs (supports filters)    | Public |
| GET    | /cutoff/cutoffs/:id    | Get cutoff by ID                      | Public |
| PUT    | /cutoff/cutoffs/:id    | Update cutoff                         | Admin  |
| DELETE | /cutoff/cutoffs/:id    | Delete cutoff                         | Admin  |

>  **Filtering Example:**  
> `/cutoff/cutoffs?collegeId=xxx&year=2024&category=GEN&round=1`

---

##  Prediction Routes

| Method | Endpoint             | Description                           | Access  |
|--------|----------------------|---------------------------------------|---------|
| POST   | /predict             | Generate prediction for student       | Student |
| GET    | /predict/:studentId  | Get predictions for student           | Student |
| DELETE | /predict/:_id        | Delete prediction by ID               | Admin   |

>  **Prediction Logic Includes:**  
> student rank, category, quota, seatType, closing rank, round

---

##  Authentication (JWT Middleware)

```js
// middleware/auth.js
const verifyToken = (req, res, next) => {
  // JWT token verification logic
};


###  Prediction Logic Should Match:

- Student rank  
- Category  
- Cutoff range  
- Closing rank  
- Quota & seat type  

---

##  Authentication Notes

Use JWT-based Auth for Admin and Student.

Protect routes using middleware like:

```js
const verifyToken = (req, res, next) => {
  // JWT verification logic
};
```


##  Sample Flow
1. Admin logs in and receives a token.

2. Admin creates Colleges, Branches, Counselling sessions.

3. Admin uploads Cutoffs.

4. Student registers and logs in.

5. Student predicts eligible colleges.

6. Prediction results are stored and retrieved.


#### Suggested Folder Structure
```rust

college_predictor/
│
├── models/         -> Mongoose Schemas
│   └── *.js
├── routes/         -> Express Routes
│   └── admin.js, student.js, predict.js, etc.
├── controllers/    -> Business Logic
│   └── *.js
├── middleware/     -> JWT Auth Checks
│   └── auth.js
├── config/         -> DB connection setup
│   └── db.js
├── app.js          -> Main App Configuration
├── server.js       -> Server Entry Point
```
