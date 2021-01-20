// const User = require("../models/User");
const Feedback = require("../models/Feedback");

exports.createFeedback = async (req, res) => {
  const feedback = await Feedback.create({
    message: req.body.message,
    sender: req._id,
  });
  if (feedback) {
    return res
      .status(200)
      .json({ success: true, response: "Feedback sent successfully" });
  } else {
    return res
      .status(400)
      .json({ success: false, response: "Error creating feedback" });
  }
};
