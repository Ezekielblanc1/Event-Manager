const nodeMailer = require("nodemailer");

exports.mailerTester = async (emails, message, subject, fromWho) => {
  // Generate test SMTP service account fromWho ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodeMailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  const transporter = nodeMailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user, //"adelbert92@ethereal.email",
      pass: testAccount.pass, //"ZbM88AbwFrnU5CuEpX",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: fromWho ? fromWho : '"Eventz" <info@eventz.ng>', // sender address
    // bcc : fromWho ? "info@eventPlanz.ng" : emails , // list of receivers
    to: fromWho ? "info@eventz.ng" : emails, // list of receivers
    subject: subject, // Subject line
    html: message, // html body
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
};
