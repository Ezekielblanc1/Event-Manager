const moment = require("moment");
const Talk = require("../models/Talks");
const ErrorResponse = require("../utils/errorResponse");
checkTalkAvailability = async (req, res, next) => {
  const talk = await Talk.findOne({ _id: req.body.talkId });
  let current_time = moment().format("YYYY-MM-DD HH:mm a");
  let end_time = moment(talk.endTime).format("YYYY-MM-DD HH:mm a");
  if (current_time >= end_time) {
    return next(
      new ErrorResponse("Talk no longer accessible as it has expired", 403)
    );
  }
  next();
};

module.exports = checkTalkAvailability;

