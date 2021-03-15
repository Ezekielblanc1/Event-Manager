exports.calculateDiscount = (arr, price) => {
  if (arr.length >= 3 && arr.length < 6) {
    const currentPrice = 0.03 * price;
    return price - currentPrice;
  } else if (arr.length >= 8 && arr.length < 16) {
    const currentPrice = 0.04 * price;
    return price - currentPrice;
  } else if (arr.length >= 20) {
    const currentPrice = 0.05 * price;
    return price - currentPrice;
  }
};

exports.calcAverage = (arr) => {
  const total = arr.reduce((acc, val) => {
    return acc + val;
  }, 0);
  const average = total / arr.length;
  return Math.round(average * 10) / 10;
};

exports.escapeRegex = (str) => {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};
