const express = require("express");
const router = express.Router();
const verifyJWTToken = require("../Middleware/verifyJWTToken.middleware");
const {
  addClassRoomController,
  getClassRoomController,
  joinClassRoomController,
  classRoomDetailsController,
} = require("../Controllers/classroom.controller");

// Define the addclassroom route
router.post("/addclassroom", verifyJWTToken, function (req, res) {
  addClassRoomController(req, res);
});

// Define the getclassrooms route
router.post("/getclassrooms", verifyJWTToken, function (req, res) {
  getClassRoomController(req, res);
});

// Define the joinclassroom route
router.post("/joinclassroom", verifyJWTToken, function (req, res) {
  joinClassRoomController(req, res);
});

// Define the getclassroomdetails route
router.post("/getclassroomdetails", verifyJWTToken, function (req, res) {
  classRoomDetailsController(req, res);
});

module.exports = router;
