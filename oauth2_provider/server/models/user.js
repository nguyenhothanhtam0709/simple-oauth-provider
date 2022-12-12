require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  createdAt: { type: Date, default: Date.now },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const access = "auth";
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
    .toString();
  user.tokens.push({ access, token });
  await user.save();
  return token;
};

UserSchema.methods.generateOAuthCode = async function (project) {
  const user = this;
  const access = "oauth";
  const token = jwt
    .sign(
      {
        access,
        _id: user._id.toHexString(),
        projectID: project.projectID,
        projectSecret: project.projectSecret,
        scope: project.scope,
      },
      process.env.JWT_SECRET
    )
    .toString();
  user.tokens.push({ access, token });
  await user.save();
  return token;
};

UserSchema.methods.generateAccessToken = async function (scope) {
  const user = this;
  const access = "access_token";
  const token = jwt
    .sign(
      { _id: user._id.toHexString(), access, scope },
      process.env.JWT_SECRET
    )
    .toString();
  user.tokens.push({ access, token });
  await user.save();
  return token;
};

UserSchema.statics.findByToken = async function (token, access) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject({ code: 401, message: "Invalid Code" });
  }
  const user = await User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": access,
  });
  return {
    decoded,
    user,
  };
};

UserSchema.statics.findByCredentials = async function (email, password) {
  const User = this;
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ code: 400, message: "Invalid Credentials" });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (isValid) {
    return user;
  } else {
    throw new Error("Password missmatch");
  }
};

UserSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.removeToken = function (token) {
  const user = this;
  return user.updateOne({
    $pull: {
      tokens: { token },
    },
  });
};

module.exports = mongoose.model("User", UserSchema);
