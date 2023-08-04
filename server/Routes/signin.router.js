const express = require("express");
const router = express.Router();
const requiredSignInData = require("../Middleware/requiredSignInData.middleware");
const verifyGoogleToken = require("../Middleware/verifyGoogleToken.middleware");
const userSignIn = require("../Controllers/userSignIn.controller");
// Define the local resister route
router.post(
  "/signin",
  [verifyGoogleToken, requiredSignInData],
  function (req, res) {
    userSignIn(req, res);
  }
);

module.exports = router;