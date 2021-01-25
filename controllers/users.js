const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { cloudinaryConfig } = require("../config/cloudinary");
const { mailerTester } = require("../helpers/emailHelper");
const cloudinary = require("cloudinary");
const ErrorResponse = require("../utils/errorResponse");

exports.signUp = async (req, res, next) => {
  const { password, email, profileImage } = req.body;
  const data = {
    image: profileImage,
  };
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    return next(new ErrorResponse("User already exists", 404));
  }
  try {
    const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync(12));
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
      email,
    });
    const message = `Thanks  ${newUser.firstName} ${newUser.lastName} for registering for this event`;
    mailerTester(newUser.email, message, "Account creation");
    if (newUser) {
      cloudinaryConfig();
      const output = cloudinary.v2.uploader.upload(data.image, {
        public_id: "",
        folder: newUser.accountType === "speaker" ? "speaker" : "guest",
      });
      newUser.profileImageUrl = (await output).url;
      await newUser.save();
    }
    return res
      .status(200)
      .json({ success: true, message: "User created successfully..." });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return next(new ErrorResponse("Incorrect password", 404));
    }
    const token = await jwt.sign(
      { email: user.email, _id: user._id },
      process.env.SECRET,
      { expiresIn: "1hr" }
    );
    return res.status(200).send({ _id: user._id, token });
  } catch (error) {
    return next(new ErrorResponse());
  }
};

exports.getUsersByLocation = async (req, res, next) => {
  const { location } = req.query;
  const users = await User.find({ location });
  return res.status(200).json({ success: true, data: users });
};

exports.getUsersCount = async (req, res, next) => {};
