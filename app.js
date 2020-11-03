const express = require("express");
const path = require("path");
const routes = require("./routes/index");
const loginRouter = require("./routes/loginRouter");
const workoutRouter = require("./routes/workoutRouter");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

const app = express();

app.set("port", process.env.PORT || 3000);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
if (process.env.NODE_ENV === "production") {
  mongoose.connect(
    "mongodb+srv://dbUser:dbUserPassword@cluster0.8gtzz.azure.mongodb.net/Fitness?retryWrites=true&w=majority"
  );
} else {
  mongoose.connect("mongodb://localhost:27017/Fitness");
}
var db = mongoose.connection;
// mongo error
db.on("error", console.error.bind(console, "connection error:"));

// use sessions for tracking logins
app.use(
  session({
    secret: "very secret secret",
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db,
    }),
  })
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", routes, loginRouter, workoutRouter);
module.exports = app;
