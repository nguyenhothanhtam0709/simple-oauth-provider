const express = require("express");
const R = require("ramda");

const { verifyAuthToken } = require("../middlewares/authenticate");
const projectMiddleware = require("../middlewares/projectMiddleware");
const User = require("../models/user");

const router = express.Router();

router.route("/register").post(async function (req, res) {
  try {
    const body = R.pick(["name", "phone", "email", "password"], req.body);
    const user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    return res.header("x-auth", token).send(R.pick(["name"], user));
  } catch (e) {
    console.log(e);
    res.status(400).send({ code: 400, message: e });
  }
});

router.route("/login").post(async function (req, res) {
  const body = R.pick(["email", "password"], req.body);
  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(R.pick(["name"], user));
  } catch (e) {
    console.log(e);
    res.status(400).send({ code: 400, message: e });
  }
});

router.route("/logout").delete(verifyAuthToken, async function (req, res) {
  try {
    await req.user.removeToken(req.token);
    return res.send({ message: "Logout Successfull" });
  } catch (e) {
    console.log(e);
    res.status(400).send({ code: 400, message: e });
  }
});

module.exports = router;
