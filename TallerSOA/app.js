let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let cors = require("cors");
let indexRouter = require("./routes/index");
let usersRouter = require("./routes/users");
let app = express();

let corsOptions = {
  origin: "http://localhost:3000",
};

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", (req, res, next) => {
  // NOTE: check if content type is in headers, and if it is application/json
  let contype = req.headers["content-type"];
  if (!contype || contype.indexOf("application/json") !== 0) {
    // NOTE: if if content-type is null/undefined, or is NOT appication/json
    // return an error
    req.status(415).send({ error: true, message: "Unsupported Media Type" });
  }
  indexRouter(req, res, next);
});
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.status(405).send({ error: true, message: "método no existente" });
});

const PORT = 3088; // NOTE: add variable to make this searchable
app.listen(PORT);

module.exports = app;
