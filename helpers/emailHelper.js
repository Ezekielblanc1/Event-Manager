const nodeMailer = require("nodemailer");

const isProd = process.env.NODE_ENV === "production";

const EmailSender = {
  sendMail: async function (emails, message, subject, fromWho) {
    isProd
      ? await this.mailer(emails, message, subject, fromWho)
      : await this.mailerTester(emails, message, subject, fromWho);
  },

  mailer: async function (emails, message, subject, fromWho) {
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    // send mail with defined transport object
    let mailData = await transporter.sendMail({
      from: fromWho ? fromWho : `"Eventz" <${process.env.EMAIL_USER}>`,
      to: emails,
      subject: subject,
      html: message,
    });
    console.info(mailData);

    return "Done";
  },

  mailerTester: async function (emails, message, subject, fromWho) {
    let testAccount = await nodeMailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodeMailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // send mail with defined transport object
    let mailData = await transporter.sendMail({
      from: fromWho ? fromWho : '"Eventz" <info@eventz.ng>',
      to: emails,
      subject: subject,
      html: message,
    });

    console.info("Preview URL: %s", nodeMailer.getTestMessageUrl(mailData));

    return "done";
  },
};

module.exports = EmailSender;


