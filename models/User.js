const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  talkId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
});
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["speaker", "guest"],
    },
    socialMediaHandles: [
      {
        type: String,
      },
    ],
    talk: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "talks",
    },
    referred: [referralSchema],
    amountToPay: {
      type: Number,
      default: 0,
    },
    reference: String,
    hasPaid: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
    },
    profileImageUrl: {
      type: String,
    },
    location: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.accountType === "speaker") {
    this.referred = undefined;
    this.amountToPay = undefined;
    this.reference = undefined;
    this.hasPaid = undefined;
  }
  return next();
});

module.exports = mongoose.model("user", userSchema);
