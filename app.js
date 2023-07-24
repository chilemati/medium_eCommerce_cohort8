const helmet = require("helmet");
const express = require("express");
const route = require("./routes/Routes");
const bodyParser = require("body-parser");
const connectDb = require("./utils/connectDb");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const origin = ["http://localhost:3000", "http://localhost:3001"];
const path = require("path");

const app = express();
const dotenv = require("dotenv").config();
let { PORT } = process.env;

//! middlewares
app.use(cookieParser()); // makes us have access to cookies using req.cookies
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "https: data:"],
      },
    },
  })
); // block most hacking to your backend
app.use(bodyParser.json()); // accept json from frontend
app.use(bodyParser.urlencoded({ extended: true })); // accept form data from frontend
app.use(cors({ credentials: true, origin: origin }));
app.use("/api", route);

//----------------------deployement-----------------------
// serve react frontend as static file from backend
app.use(express.static(path.join(__dirname, "/client/build")));

// whenever there is a get request, send the index page from react
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

//! start server
connectDb(() => {
  app.listen(PORT || 4000, () => {
    console.log(`Listening to request on port ${PORT}`);
  });
});
