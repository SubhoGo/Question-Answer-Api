require("dotenv").config();
const express = require("express");
const { resolve, join } = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const app = express();


// Define the upload directory path
const uploadDir = join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

require("app-module-path").addPath(__dirname + "/app/modules");
global.appRoot = join(__dirname, "/app");

// Initialize the auth middleware
const authMiddleware = require(resolve(join(__dirname, "app/middleware", "auth")))();
global.auth = authMiddleware; 


const router = require("./app/router/app.routes");
app.use(authMiddleware.initialize()); 

// Middleware
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "/public")));
app.use("/images", express.static(join(__dirname, "public/uploads")));

// Token handling middleware
app.use((req, res, next) => {
  const token = req.cookies.token || req.headers["x-access-token"];
  if (token) {
    req.headers["x-access-token"] = token;
  }
  next();
});

// Use routes
app.use("/", router);

// Start the server
(async () => {
  try {
    const port = process.env.DB_PORT || 3032;
    await require(resolve(join(__dirname, "app/config", "database")))();
    app.listen(port, () => {
      console.log(
        `Project is running on http://${
          process.env.HOST || "localhost"
        }:${port}`
      );
    });
  } catch (error) {
    console.error("Database connection failed", error);
  }
})();
