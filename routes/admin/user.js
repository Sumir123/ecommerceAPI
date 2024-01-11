const express = require("express");
const { signup, signin } = require("../../controller/admin/user");
const {
  validateSignupRequest,
  isRequestValidated,
  validateSignInRequest,
} = require("../../validatiors/auth");

const router = express.Router();

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", validateSignInRequest, isRequestValidated, signin);

module.exports = router;
