const customError = (errStatus, message) => {
  let err = new Error(message);
  err.status = errStatus;
  throw err;
};

const sendError = (err, res) => {
  if (err.status) {
    res.status(err.status).send(err.message);
  } else {
    res.status(500).send(err.message);
  }
  console.log(err);
};

const verifySeller = (isSeller) => {
  if (!isSeller) {
    let err = new Error("Unathorized Access !");
    err.status = 401;
    throw err;
  }
};

const verifyBuyer = (isSeller) => {
  if (isSeller) {
    let err = new Error("Api only for Buyer.");
    err.status = 401;
    throw err;
  }
};

module.exports = {
  customError,
  sendError,
  verifySeller,
  verifyBuyer
};
