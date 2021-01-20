const Review = require("../models/Reviews");
const Talk = require("../models/Talks");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const { calcAverage } = require("../helpers/index");

exports.addReview = async (req, res, next) => {
  const talkId = req.params.talkId;
  const getTalk = await Talk.findOne({ _id: talkId });
  const reviewDetail = await Review.findOne({
    $and: [{ userId: req._id }, { talkId }],
  });
  if (reviewDetail) {
    reviewDetail.reviewText = req.body.reviewText;
    reviewDetail.rating = req.body.rating;
    await reviewDetail.save();
    return res
      .status(200)
      .json({ success: true, message: "Review updated successfully" });
  }
  if (!req.body.reviewText) {
    return next(new ErrorResponse("Please provide a review", 400));
  }
  if (!req.body.rating) {
    return next(new ErrorResponse("Please select a rating", 400));
  }

  if (!getTalk.attendees.includes(req._id)) {
    return next(
      new ErrorResponse("You did not attend this talk so you can't rate it"),
      403
    );
  }

  const review = await Review.create({ ...req.body, talkId, userId: req._id });
  const getReviews = await Review.find({ talkId });
  const ratingsArr = getReviews.map((review) => review.rating);

  getTalk.averageRating = calcAverage(ratingsArr);
  await getTalk.save();
  await Talk.updateOne(
    { _id: review.talkId },
    {
      $addToSet: {
        ratings: review._id,
      },
    }
  );
  return res
    .status(200)
    .json({ success: true, message: "Review sent successfully" });
};

exports.getAllRatings = async (req, res, next) => {
  const talkId = req.body.talkId;
  const allRatings = await Review.find({ talkId }).populate(
    "userId",
    "firstName lastName"
  );
  if (!allRatings) {
    return next(new ErrorResponse("No ratings found", 404));
  }
  return res.status(200).json({ success: true, data: allRatings });
};

exports.getTalkByRating = async (req, res, next) => {
  const talkId = req.body.talkId;
  const rating = req.body.rating;
  const talkByRating = await Review.find({ talkId, rating });
  console.log(talkByRating);
  res.send("Rating");
};
