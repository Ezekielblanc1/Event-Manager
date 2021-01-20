const express = require("express");
const router = express.Router();
const {
  createTalk,
  attendTalk,
  getTalk,
  getTalkWithHighestAttendees,
  getTalkAttendees,
  getTalkSpeakers,
  attendTalkWithReferral,
  countTotalReferrals,
  cancelTalkRegistration,
  getAllAttendees,
  talkPay,
  verifyTalkPay,
  searchTalk,
  createTalkReservation,
  addSpeakerToTalk,
  // countTalkReferral
} = require("../controllers/talks");

const isAuth = require("../middleware/isAuth");
const talkAvailability = require("../middleware/talkAvailbility");

router.post("/create", isAuth, createTalk);
router.post("/attend", [isAuth, talkAvailability], attendTalk);
router.post("/reservation", isAuth, createTalkReservation);
router.post("/attendWithReferral", isAuth, attendTalkWithReferral);
router.post("/talkPay", isAuth, talkPay);
router.post("/addSpeaker/:id", isAuth, addSpeakerToTalk);
router.post("/verifyTalkPay", isAuth, verifyTalkPay);
router.get("/singleTalk/:id", getTalk);
router.get("/speakers/:id", getTalkSpeakers);
router.get("/highestAttendee", getTalkWithHighestAttendees);
router.get("/talkAttendees", isAuth, getTalkAttendees);
router.get("/countReferrals", isAuth, countTotalReferrals);
router.get("/allAttendees", getAllAttendees);
router.get("/searchBy", searchTalk);
// router.get('/countTalkReferral/:id', isAuth, countTalkReferral)
router.delete("/cancelTalkReg", isAuth, cancelTalkRegistration);
module.exports = router;
