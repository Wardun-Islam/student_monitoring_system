const express = require("express");
const router = express.Router();
const {
  googleTokenVerification,
} = require("../Controllers/googleToken.controller");

const {
  getStudentsController,
  addstudentimageController,
  getIdentifiedImage,
} = require("../Controllers/student.controller");
const verifyJWTToken = require("../Middleware/verifyJWTToken.middleware");
const requiredAddStudentImageData = require("../Middleware/requiredAddStudentImageData.middleware");
const uploadPhoto = require("../Middleware/uploadPhoto.middleware");
// Define the getstudents route
router.post("/getstudents", verifyJWTToken, function (req, res) {
  getStudentsController(req, res);
});

router.post("/getidentifiedimage", verifyJWTToken, function (req, res) {
  getIdentifiedImage(req, res);
});

router.post(
  "/addstudentimage",
  [verifyJWTToken, requiredAddStudentImageData, uploadPhoto],
  function (req, res) {
    addstudentimageController(req, res);
  }
);

module.exports = router;
