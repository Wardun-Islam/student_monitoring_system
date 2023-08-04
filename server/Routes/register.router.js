const express = require("express");
const router = express.Router();
const requiredRegisteredData = require("../Middleware/requiredRegisterData.middleware");
const uploadPhoto = require("../Middleware/uploadPhoto.middleware");
const userRegistration = require("../Controllers/userRegistration.controller");
// Define the local resister route
router.post(
  "/register",
  [requiredRegisteredData, uploadPhoto],
  function (req, res) {
    if (req.photo_move_error) {
      return res.status(400).json({
        registration_status: "failed",
        error: {
          ecode: 301,
          details: "Failed to upload photo of user.",
          err: req.photo_move_error,
        },
      });
    }
    userRegistration(req, res);
  }
);

module.exports = router;
