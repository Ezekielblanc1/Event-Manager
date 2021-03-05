const SubscriberModel = require("../models/Subscribers");
const ErrorResponse = require("../utils/errorResponse");
const EmailSender = require("../helpers/emailHelper");


exports.getAllSubscribers = async (req, res, next) => {
  const getSubscribers = await SubscriberModel.find();
  if (!getSubscribers) {
    return next(new ErrorResponse("Error fetching subscribers", 404));
  }
  return res.status(200).json({ success: true, data: getSubscribers });
};

exports.getSubscriber = async (req, res, next) => {
  const getSubscriber = await SubscriberModel.findOne({
    _id: req.params.subscriberId,
  });
  if (!getSubscriber) {
    return next(new ErrorResponse("Error fetching subscriber", 404));
  }
  return res.status(200).json({ success: true, data: getSubscriber });
};

exports.addSubscriber = async (req, res, next) => {
  const { email } = req.body;
  const haveSubscribed = await SubscriberModel.findOne({ email });
  if (haveSubscribed) {
    return next(new ErrorResponse("You have already subscribed", 400));
  }
  await SubscriberModel.create({ email });
  res
    .status(200)
    .json({ success: true, message: "You have successfully subscribed" });
  const message = `
    Welcome to <b>EventzNg</b>, we are thrilled you have joined us.
    <br />
    You will be receiving useful information from us every friday to help you stay updated with latest information about your favorite conferences and events
    `;
  EmailSender.sendMail(email, message, "Welcome on board");
};
exports.cancelSubscription = async (req, res, next) => {
  const { email } = req.params;
  const getSubscriber = await SubscriberModel.findOne({ email });
  if (!getSubscriber) {
    return next(
      new ErrorResponse(
        "You did not subscriber to the newsletter publication",
        400
      )
    );
  }
  await SubscriberModel.findOneAndDelete({ email });
  return res
    .status(200)
    .json({ success: true, message: "You have cancelled your subscription" });
};
