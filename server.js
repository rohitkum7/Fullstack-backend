require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 8001;

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://richajha903:GA4HrAGFAH34IsqF@cluster0.a7oihnf.mongodb.net/"
  )
  .then(() => console.log("Database is connected..."))
  .catch((err) => console.log(err));

//db schema
const userSchema = mongoose.Schema({
  name: String,
  lastName: String,
});

//db model
const User = new mongoose.model("User", userSchema);

app.get("/get-users", (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => console.log(err));
});

app.post("/create", (req, res) => {
  //save to mongodb and send response
  const newUser = new User({
    name: req.body.name,
    lastName: req.body.lastName,
  });

  newUser
    .save()
    .then((user) => res.json(user))
    .catch((err) => console.log(err));
});

// Update existing route for deleting a user
app.delete("/delete/:id", (req, res) => {
  const userId = req.params.id;
  User.findByIdAndDelete(userId)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch((err) => console.log(err));
});

// Update existing route for updating a user
app.put("/update/:id", (req, res) => {
  const userId = req.params.id;
  const { name, lastName } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, lastName },
    { new: true } // Return the modified document rather than the original
  )
    .then((user) => res.json(user))
    .catch((err) => console.log(err));
});

// app.use(express.static("./client/build"));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
// });
app.listen(port, () => {
  console.log(`Server is running on post ${port}`);
});
