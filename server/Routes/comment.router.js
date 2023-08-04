const express = require("express");
const router = express.Router();
const verifyJWTToken = require("../Middleware/verifyJWTToken.middleware");
const verifyUserForComment = require("../Middleware/verifyUserForComment.middleware");
const {
  addCommentController,
  getCommentController,
} = require("../Controllers/comment.controller");

// Define the addcomment route
router.post(
  "/addcomment",
  [verifyJWTToken, verifyUserForComment],
  function (req, res) {
    addCommentController(req, res);
  }
);

// Define the getcomment route
router.post(
  "/getcomments",
  [verifyJWTToken, verifyUserForComment],
  function (req, res) {
    getCommentController(req, res);
  }
);

module.exports = router;
