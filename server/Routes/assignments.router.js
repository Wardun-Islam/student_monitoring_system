const express = require("express");
const router = express.Router();
const verifyJWTToken = require("../Middleware/verifyJWTToken.middleware");
const uploadPdf = require("../Middleware/uploadPdf.middleware");
const {
  addAssignmentController,
  getAssignmentDetailsController,
  getAllAssignmentsController,
  getClassroomAssignmentsController,
} = require("../Controllers/assignments.controller");

// Define the addassignment route
router.post("/addassignment", [verifyJWTToken, uploadPdf], function (req, res) {
  addAssignmentController(req, res);
});

// Define the getassignmentdetails route
router.post("/getassignmentdetails", verifyJWTToken, function (req, res) {
  getAssignmentDetailsController(req, res);
});

// Define the getallassignments route
router.post("/getallassignments", verifyJWTToken, function (req, res) {
  getAllAssignmentsController(req, res);
});

// Define the getclassroomassignments route
router.post("/getclassroomassignments", verifyJWTToken, function (req, res) {
  getClassroomAssignmentsController(req, res);
});

module.exports = router;
