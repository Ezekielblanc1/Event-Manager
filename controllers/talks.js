const User = require("../models/User");
const Talk = require("../models/Talks");
const { calculateDiscount, escapeRegex } = require("../helpers/index");
const sendSms = require("../helpers/sms");
const {
  initializeTransaction,
  verifyTransactionFnc,
} = require("../config/paystack");
const ErrorResponse = require("../utils/errorResponse");
const Reserve = require("../models/Reserve");

exports.createTalk = async (req, res, next) => {
  if (!req.body.title || !req.body.description) {
    return next(
      new ErrorResponse("You must provide title and description", 400)
    );
  }
  const talk = await Talk.findOne({ title: req.body.title });
  const user = await User.findOne({ _id: req._id });
  if (talk) {
    return next(new ErrorResponse("Talk already exist", 401));
  }
  if (user.accountType !== "speaker") {
    return next(
      new ErrorResponse("Cannot create talk if you are not a speaker", 403)
    );
  }
  const createdTalk = await Talk.create({ ...req.body });
  try {
    await Talk.updateOne(
      { _id: createdTalk._id },
      { $addToSet: { speakers: user._id } }
    );
    res
      .status(200)
      .json({ success: true, message: "Talk created succesfully" });
  } catch (error) {
    return next(new ErrorResponse());
  }
};

exports.addSpeakerToTalk = async (req, res, next) => {
  await Talk.updateOne(
    { _id: req.params.id },
    { $addToSet: { speakers: req._id } }
  );
  res
    .status(200)
    .json({ success: true, message: "Speaker added to talk succesfully" });
};

exports.attendTalk = async (req, res, next) => {
  const getTalk = await Talk.findOne({ _id: req.body.talkId });
  const user = await User.findOne({ _id: req._id });
  if (!getTalk) {
    return next(new ErrorResponse("Error getting selected talk", 404));
  }

  //Check if talk seat reservation is still open
  if (getTalk.attendees.length === getTalk.maxSeatCapacity) {
    return next(
      new ErrorResponse(
        "This talk has reached the maximum number of attendees it can seat",
        403
      )
    );
  }

  //Check for attendee talk eligibility..
  const checkEligibilty = getTalk.attendees.includes(req._id);
  if (checkEligibilty) {
    return next(
      new ErrorResponse("You have already registered for this talk", 403)
    );
  }

  user.amountToPay = getTalk.price;
  getTalk.attendees.push(req._id);
  await user.save();
  await getTalk.save();
  const welcomeMessage =
    "Welcome to Event Planz, we would contact shortly via email";

  sendSms(user.phone, welcomeMessage);
  res.status(200).json({
    success: true,
    message: "You have successfully registered for this talk",
  });
};

exports.createTalkReservation = async (req, res, next) => {
  const talk = await Talk.findOne({ _id: req.body.talkId });
  if (!talk) {
    return next(new ErrorResponse("Error getting selected talk", 404));
  }
  if (req.body.reserved) {
    await Reserve.create({
      userId: req._id,
      talkId: talk._id,
    });
    return res.status(200).json({
      success: true,
      message: "You have been enlisted in the reserve slot for this talk",
    });
  }
};

exports.attendTalkWithReferral = async (req, res, next) => {
  const getTalk = await Talk.findOne({ _id: req.body.talkId });
  if (!getTalk) {
    return next(new ErrorResponse("Error getting selected talk", 404));
  }
  const checkEligibilty = getTalk.attendees.includes(req._id);
  if (checkEligibilty) {
    return next(
      new ErrorResponse("You have already registered for this talk", 403)
    );
  }
  getTalk.attendees.push(req._id);
  await getTalk.save();
  await User.updateOne(
    { _id: req.query.referralId },
    {
      $push: {
        referred: {
          talkId: getTalk._id,
          userId: req._id,
        },
      },
    }
  );
  const userReferrals = await User.findOne({ _id: req.query.referralId });
  const currentUser = await User.findOne({ _id: req._id });
  currentUser.amountToPay = getTalk.price;
  await currentUser.save();
  const discount = calculateDiscount(userReferrals.referred, getTalk.price);
  userReferrals.amountToPay = !discount ? userReferrals.amountToPay : discount;
  await userReferrals.save();

  const welcomeMessage =
    "Welcome to Event Planz, we would contact shortly via email";

  sendSms(user.phone, welcomeMessage);
  res.status(200).json({
    success: true,
    message: `You have successfully registered for this talk with referral link ${req.query.referralId}`,
  });
};

exports.getTalk = async (req, res, next) => {
  const talk = await Talk.findOne({ _id: req.params.id }).populate(
    "attendees",
    "firstName lastName email "
  );
  return res.status(200).json({ success: true, data: talk });
};

exports.getTalkWithHighestAttendees = async (req, res, next) => {
  const getAllTalks = await Talk.find({});
  let attendeeCount = getAllTalks.map((talkItem) => talkItem.attendees.length);
  let countArr = Math.max(...attendeeCount);
  let newArr = getAllTalks.filter((talk) => {
    if (talk.attendees.length == countArr) return talk;
  });
  const data = newArr;
  if (!data) {
    return next(new ErrorResponse("No data available", 404));
  }
  res.status(200).json({ success: true, data });
};

exports.getTalkAttendees = async (req, res, next) => {
  const talk = await await Talk.findOne({
    speakers: { $in: [req._id] },
  }).populate("attendees", { firstName: 1, lastName: 1, email: 1, _id: 0 });
  if (!talk) {
    return next(new ErrorResponse("No data available", 404));
  }
  res.status(200).json({ success: true, data: talk.attendees });
};

exports.getTalkSpeakers = async (req, res, next) => {
  const speakers = await Talk.findOne({ _id: req.params.id })
    .populate("speakers")
    .select("speakers -_id");
  if (!speakers) {
    return next(new ErrorResponse("Error Fetching Speakers", 404));
  }
  res.status(200).json({ success: true, data: speakers });
};

exports.countTotalReferrals = async (req, res, next) => {
  const user = await User.findOne({ _id: req._id, accountType: "guest" });
  if (!user) {
    return next(new ErrorResponse("Error getting user", 404));
  }

  res.status(200).json({ success: true, data: user.referred.length });
};

exports.cancelTalkRegistration = async (req, res) => {
  const { talkId } = req.body;
  await Talk.updateOne({ _id: talkId }, { $pull: { attendees: req._id } });
  await User.updateOne(
    { referred: { $elemMatch: { userId: req._id, talkId: talkId } } },
    { $pull: { referred: { userId: req._id } } }
  );
  await User.updateOne({ _id: req._id }, { $set: { amountToPay: 0 } });
  res.status(200).json({
    success: true,
    message: "You have successfully opted out of this talk",
  });
};

exports.getAllAttendees = async (req, res, next) => {
  const attendees = await User.find({ accountType: "guest" });
  if (!attendees) {
    return next(new ErrorResponse("Data not available", 404));
  }
  return res.status(200).json({ success: true, data: attendees });
};

exports.talkPay = async (req, res, next) => {
  const user = await User.findOne({ _id: req._id }).select(
    "email amountToPay _id"
  );
  if (!user) {
    return next(new ErrorResponse("User not available", 404));
  }
  const ref = Math.random().toString(36).slice(2);
  await initializeTransaction(user, ref);
  user.reference = ref;
  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Payment initialized" });
};
exports.verifyTalkPay = async (req, res, next) => {
  const user = await User.findOne({ _id: req._id });
  if (!user) {
    return next(new ErrorResponse("User not available", 404));
  }
  await verifyTransactionFnc(user.reference);
  user.hasPaid = true;
  await user.save();
  return res.status(200).json({ success: true, message: "Payment verified" });
};

exports.searchTalk = async (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    const talks = await Talk.find({ title: regex });
    res.status(200).json({ success: true, data: talks });
  } else {
    const talks = await Talk.find({});
    res.status(200).json({ success: true, data: talks });
  }
};

exports.askQuestion = async () => {};
// exports.countTalkReferral = async (req, res) => {
//   const { id } = req.params;
//   const user = await User.findOne({ _id: req._id });
//   const result = user.referred.filter((item) => {
//     return item.talkId.toString() === id;
//   });

//   res.status(200).json({ success: true, data: result.length });
// };
