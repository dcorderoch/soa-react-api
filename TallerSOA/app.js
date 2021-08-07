var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(cors());
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
    // TODO: check HTTP error codes to see if 405 is appropriate
    req.status(405).send({ error: true, message: "unsuppoerted MIME type" });
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

let port = 3088; // NOTE: add variable to make this searchable
app.listen(port);

module.exports = app;
