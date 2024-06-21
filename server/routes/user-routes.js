const express = require("express");
const { check } = require("express-validator");

const userController = require("../controllers/user-controllers");

const router = express.Router();

router.get("/", userController.getUser);

router.post(
  "/signup",
  [
    check("firstname").not().isEmpty(),
    check("lastname").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("username").not().isEmpty(),
    check("password").isLength({ min: 6 }),
    check("adminCode").not().isEmpty(),
  ],
  userController.signup
);

router.post("/login", userController.login);

module.exports = router;
