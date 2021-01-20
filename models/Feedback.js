const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const feedback = mongoose.model("feedback", feedbackSchema);
module.exports = feedback;
