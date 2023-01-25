require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const chalk = require("chalk");

const armyController = require("./controllers/army");
const User = require("./models/User");


const app = express();
app.set("view engine", "ejs");


const { WEB_PORT, MONGODB_URI } = process.env;
const userController = require("./controllers/user");


mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use(expressSession({ secret: 'foo barr', saveUninitialized: true, resave: false, cookie: {} }))


app.use("*", async (req, res, next) => {
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users", userController.list);

app.post("/create-army", armyController.create);
app.get("/create-army", (req, res) => {
  res.render("create-army", { errors: {}});
});

app.get("/armies", armyController.list);
app.get("/armies/delete/:id", armyController.delete);
app.get("/armies/update/:id", armyController.edit);
app.post("/armies/update/:id", armyController.update);

app.get("/register", (req, res) => {
  res.render('register', { errors: {} })
});

app.post("/register", userController.create);

app.get("/login", (req, res) => {
  res.render('login', { errors: {} })
});
app.post("/login", userController.login);


app.listen(WEB_PORT, () => {
  console.log(
    `Example app listening at http://localhost:${WEB_PORT}`,
    chalk.blueBright("✓")
  );
});

