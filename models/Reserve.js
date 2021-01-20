const mongoose = require("mongoose");

const reserveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    talkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "talks",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("reserve", reserveSchema);
