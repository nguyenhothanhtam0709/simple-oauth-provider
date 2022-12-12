const Project = require("../models/project");

const projectMiddle = async function (req, res, next) {
  try {
    const projectID = req.query.projectID;
    const redirectURL = req.query.redirectURL;
    const scope = req.query.scope;
    const project = await Project.findOne({ projectID });

    if (!project) {
      throw new Error({
        code: 404,
        message: "Project ID does not exist",
      });
    }
    if (!project.redirectURLs.includes(redirectURL)) {
      throw new Error({ code: 400, message: "Redirect URL mismatch" });
    }
    if (project.scope != scope) {
      throw new Error({ code: 400, message: "Invalid Scope" });
    }
    req.project = project;
    next();
  } catch (e) {
    if (e.code) {
      res.status(e.code).send(e);
    } else {
      res.status(500).send({ message: "Unknown Error" });
    }
  }
};

module.exports = projectMiddle;
