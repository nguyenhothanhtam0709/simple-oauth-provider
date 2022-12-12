const User = require("../models/user");

const verifyAuthToken = async function (req, res, next) {
  try {
    const token =
      req.header("x-auth") || req.query.code || req.query.access_token;
    const data = await User.findByToken(token, "auth");

    if (!data.user) {
      throw new Error({ code: 401, message: "Invalid X-Auth Token" });
    }
    req.user = data.user;
    req.token = token;
    next();
  } catch (e) {
    if (e.code) {
      res.status(e.code).send(e);
    } else {
      console.log(e);
      res.status(500).send({ code: 500, message: "Unknown Error" });
    }
  }
};

const verifyOAuthCode = async function (req, res, next) {
  try {
    const token = req.query.code;
    const data = await User.findByToken(token, "oauth");
    if (!data.user) {
      throw new Error({ code: 403, message: "Invalid code" });
    }

    const project = req.project;
    const decoded = data.decoded;
    if (
      decoded.projectID != project.projectID ||
      decoded.projectSecret != project.projectSecret ||
      decoded.scope != project.scope
    ) {
      return res.status(400).send({
        code: 403,
        message: "The code does not belong to the project",
      });
    }
    req.user = data.user;
    req.decoded = decoded;
    req.token = token;
    next();
  } catch (e) {
    if (e && e.code) {
      res.status(e.code).send(e);
    } else {
      console.log(e);
      res.status(500).send({ code: 500, message: "Unknown Error" });
    }
  }
};

const verifyAccessToken = async function (req, res, next) {
  try {
    const token = req.query.access_token;
    const data = await User.findByToken(token, "access_token");
    if (!data.user) {
      throw new Error({ code: 403, message: "Invalid Access Token" });
    }
    req.user = data.user;
    req.decoded = data.decoded;
    req.token = token;
    next();
  } catch (e) {
    if (e.code) {
      res.status(e.code).send(e);
    } else {
      console.log(e);
      res.status(500).send({ code: 500, message: "Unknown Error" });
    }
  }
};
module.exports = { verifyAccessToken, verifyAuthToken, verifyOAuthCode };
