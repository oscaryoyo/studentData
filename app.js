const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { Schema } = mongoose;
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://localhost:27017/exampleDB")
  .then(() => {
    console.log("成功連線");
  })
  .catch((e) => {
    console.log(e);
  });

const studentSample = new Schema({
  name: String,
  age: Number,
  scholarship: {
    merit: Number,
    other: Number,
  },
});

const Student = mongoose.model("Student", studentSample);

app.get("/students", async (req, res) => {
  try {
    let showStudent = await Student.find({}).exec();
    console.log(showStudent);
    return res.render("students", { showStudent });
  } catch (e) {
    return res.status(400).send(e.value);
  }
});

//新增學生資料

app.get("/students/new", (req, res) => {
  return res.render("new-student-form");
});

app.post("/students", async (req, res) => {
  try {
    let { name, age, merit, other } = req.body;
    let newObject = new Student({
      name,
      age,
      scholarship: {
        merit,
        other,
      },
    });
    let savedStudent = await newObject.save();
    return res.render("student-save-success", { savedStudent });
  } catch (e) {
    return res.status(400).send("新增錯誤");
  }
});

app.put("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let { name, age, merit, other } = req.body;
    let newData = await Student.findOneAndUpdate(
      { _id },
      { name, age, scholarship: { merit, other } },
      { new: true, runValidators: true, overwrite: true }
    ).exec();
    return res.render("student-update-success", { newData });
  } catch (error) {}
});

app.delete("/students/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let deleStudent = await Student.findOneAndDelete({ _id }).exec();
    console.log("123");
    return res.render("delete-student", { deleStudent });
  } catch (e) {}
});

app.get("/students/:_id/edit", async (req, res) => {
  let { _id } = req.params;
  try {
    let eachStudent = await Student.findOne({ _id }).exec();
    return res.render("edit-student", { eachStudent });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

app.get("/students/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let eachStudent = await Student.findOne({ _id }).exec();
    return res.render("student-page", { eachStudent });
  } catch (e) {
    return res.status(400).render("student-not-found");
  }
});
// const newStudent = new Student({
//   name: "oscar3",
//   age: 10,
//   scholarship: {
//     merit: 2000,
//     other: 6600,
//   },
// });

// newStudent
//   .save()
//   .then((saveobject) => {
//     console.log("新增成功...");
//     console.log(saveobject);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

app.listen(3003, () => {
  console.log("伺服器正在聆聽....");
});
