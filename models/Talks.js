const mongoose = require("mongoose");

const talkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    speakers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    price: {
      type: Number,
      required: true
    },
    maxSeatCapacity: {
      type: Number,
    },
    endTime: {
      type: Date
    },
    available: {
      type: Boolean
    },
    averageRating: {
      type: Number
    },
    ratings: [mongoose.Schema.Types.ObjectId]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("talks", talkSchema);
