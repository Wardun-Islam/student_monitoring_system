const express = require("express");
const router = express.Router();
const {
  getAnnotationController,
} = require("../Controllers/annotation.controller");
const verifyJWTToken = require("../Middleware/verifyJWTToken.middleware");


// Define the annotation route
router.post("/annotation", [verifyJWTToken], function (req, res) {
  getAnnotationController(req, res);
});

module.exports = router;