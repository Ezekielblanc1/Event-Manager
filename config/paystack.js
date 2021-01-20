const PayStack = require("paystack-node");
let API_KEY = process.env.PAYSTACK_KEY;
const environment = process.env.NODE_ENV;
const paystack = new PayStack(API_KEY, environment);

//Initialize transaction

exports.initializeTransaction = (userObj, reference) => {
  const { amountToPay, email } = userObj;
  const transact = paystack.initializeTransaction({
    reference,
    amount: amountToPay,
    email,
  });
  transact
    .then((response) => {
      console.log(response.body);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.verifyTransactionFnc = (reference) => {
  const verify = paystack.verifyTransaction({
    reference,
  });
  verify
    .then((response) => {
      console.log(response.body);
    })
    .catch((error) => {
      console.log(error);
    });
};
