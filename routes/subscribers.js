const router = require("express").Router();
const {
  getAllSubscribers,
  getSubscriber,
  addSubscriber,
  cancelSubscription,
} = require("../controllers/subscribers");

router.get("/", getAllSubscribers);
router.get("/:subscriberId", getSubscriber);
router.post("/add", addSubscriber);
router.delete("/cancel/:email", cancelSubscription);

module.exports = router;
