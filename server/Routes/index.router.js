const express = require("express");
const request = require("request");
const router = express.Router();

const getRequest = () => {
  return 
};

async function fun1(req, res) {
  let response = await new Promise((resolve) => {
    request.get("http://127.0.0.1:8000/api/", function (err, response, body) {
      resolve({ err, response, body });
    });
  });
  if (response.err) {
    console.log("error");
  } else {
    console.log("fetched response");
  }
}

// Define the home page route
router.get("/", function (req, res) {
  let response = fun1(req, res);
  response.then((data) => {
    return res.send(data);
  });
});

// Define the about route
router.get("/about", function (req, res) {
  return res.send(
    "This server is created for provide Student Monitoring System's required data through different API endpoints."
  );
});

module.exports = router;
