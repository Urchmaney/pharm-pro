const OtpModel = require('../schemas/otp_schema');

const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 5; i += 1) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

const getOTP = async (phoneNumber, userType) => OtpModel.findOne({ phoneNumber, userType }).lean();

const createOTP = async (phoneNumber, userType) => {
  if (!phoneNumber) return null;
  if (userType < 1 || userType > 2) return null;
  const otp = new OtpModel({
    otp: generateOTP(),
    expiration: new Date().setMinutes((new Date()).getMinutes() + 10),
    phoneNumber,
    userType,
  });
  const errors = otp.validateSync();
  if (errors) return null;
  await otp.save();
  return otp.otp;
};

const deleteOTP = (phoneNumber, userType) => OtpModel.deleteMany({ phoneNumber, userType });

const validateOTP = async (phoneNumber, userType, otp, date) => {
  const otpObj = await OtpModel.findOne({ phoneNumber, userType, otp }).lean();
  if (!otpObj) return false;
  if (otpObj.expiration > date) {
    await deleteOTP(phoneNumber, userType);
    return true;
  }
  return false;
};

const getOTPS = async (phoneNumber) => {
  const otps = await OtpModel.find({ phoneNumber }).sort('-expiration');
  return otps.length ? otps[0].otp : 'none';
};

module.exports = {
  getOTP,
  createOTP,
  deleteOTP,
  validateOTP,
  getOTPS,
};
