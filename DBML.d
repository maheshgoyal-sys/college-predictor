Project CollegePredictor {
  database_type: "MongoDB"
  note: "All-in-one college predictor supporting JoSAA, JAC Delhi, WBJEE, etc."
}

Table Admin {
  id ObjectId [pk]
  username string [unique, not null]
  password string [not null]
  role string [not null, note: "superadmin | moderator"]
  createdAt datetime [default: `now()`]
}

Table Student {
  id ObjectId [pk]
  name string [not null]
  email string [unique, not null]
  phone string [not null, note: "Must match Indian format"]
  exam string [not null, note: "JEE Main | JEE Advanced | CUET | WBJEE"]
  rank int [not null]
  category string [not null, note: "GEN | EWS | OBC | SC | ST"]
  homeState string [not null]
  gender string [not null, note: "Male | Female | Other"]
  isActive boolean [default: true]
  lastLoginAt datetime
  lastLogoutAt datetime
  createdAt datetime
  updatedAt datetime
}

Table Counselling {
  id ObjectId [pk]
  name string [not null]
  year int [not null]
  exam string [not null]
  description string
  createdAt datetime
  updatedAt datetime
}

Table College {
  id ObjectId [pk]
  name string [not null]
  code string [not null]
  city string
  state string
  type string [not null, note: "IIT | NIT | IIIT | GFTI | Private"]
  university string
  isAutonomous boolean
  createdAt datetime
  updatedAt datetime
}

Table Branch {
  id ObjectId [pk]
  name string [not null]
  code string [not null]
  degree string [not null, note: "B.Tech | B.E | B.Arch | B.Plan"]
  duration int [default: 4]
  createdAt datetime
  updatedAt datetime
}

Table Cutoff {
  id ObjectId [pk]
  counsellingId ObjectId [ref: > Counselling.id]
  year int [not null]
  round int [not null]
  collegeId ObjectId [ref: > College.id]
  branchId ObjectId [ref: > Branch.id]
  category string [not null, note: "GEN | EWS | OBC | SC | ST"]
  quota string [not null, note: "AI | HS | OS | GO"]
  seatType string [not null, note: "Gender-Neutral | Female-Only"]
  openingRank int
  closingRank int
  createdAt datetime
  updatedAt datetime
}

Table Prediction {
  id ObjectId [pk]
  studentId ObjectId [ref: > Student.id]
  counsellingId ObjectId [ref: > Counselling.id]
  predictionDate datetime [default: `now()`]
  createdAt datetime
  updatedAt datetime
}

Table PredictedCollege {
  id ObjectId [pk]
  predictionId ObjectId [ref: > Prediction.id]
  collegeId ObjectId [ref: > College.id]
  branchId ObjectId [ref: > Branch.id]
  round int
  category string
  closingRank int
  predictedChance float
}
