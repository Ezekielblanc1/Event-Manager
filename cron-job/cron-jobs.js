const cron = require("node-cron");
const moment = require("moment");
const SubscriberModel = require("../models/Subscribers");
const EmailSender = require("../helpers/emailHelper");

moment.locale("en");
const today = moment().toDate();

cron.schedule("* * * * *", async () => {
  const isFriday = moment.weekdays(today) === "Friday";
});

cron.schedule("0 7 * 1-12 5", async () => {
  const isFriday = moment.weekdays(today) === "Friday";
  if (isFriday) {
    const subscribers = await SubscriberModel.find({}, { email: 1 });
    const subscribersList = subscribers.map((item) => item.email);

    const message = `
      Hello there,
      <br />
      <br />
      
      Top of the morning to you.
      <h2>EventzNg</h2>
      <p>
        <b>EventzNg</b>  is a platform that makes conference planning, structuring and execution as seamless as possible.
        <br />
        With this new platform, you'd be able to attend your favourite conferences, make reservations just from the comfort of your home.
      </p>
      <h3>Come Check it out</h3>
      <p>We invite you to check it out today at <a href="#">EventzNg.com</a></p>
    `;
    if (subscribersList.length === 0) return;

    EmailSender.sendMail(subscribersList, message, "EventzNg newsletter");
  }
});
