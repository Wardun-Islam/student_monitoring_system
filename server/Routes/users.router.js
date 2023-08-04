const express = require("express");
const router = express.Router();
const {
  googleTokenVerification,
} = require("../Controllers/googleToken.controller");
const { updateUserInformation } = require("../Controllers/user.controller");
const verifyJWTToken = require("../Middleware/verifyJWTToken.middleware");

// Define the verifygoogleuser route
router.post("/verifygoogleuser", function (req, res) {
  googleTokenVerification(req.body.google_token)
    .then((user) => {
      return res.status(200).json({
        isUser: true,
      });
    })
    .catch((error) => {
      return res.status(200).json({
        isUser: false,
      });
    });
});

// Define the userinfo route
router.post("/userinfo", verifyJWTToken, function (req, res) {
  if (req.authorized_user) {
    return res.status(200).json({ user: req.authorized_user });
  } else {
    return res.status(400).json({
      user: null,
      error: req.authorized_user_error,
    });
  }
});

// Define the userinfo route
router.post("/updateUser", verifyJWTToken, function (req, res) {
  updateUserInformation(req, res);
});

module.exports = router;
