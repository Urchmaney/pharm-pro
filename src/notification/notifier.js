require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const sendSMS = async (data, phoneNumber) => {
  try {
    await client.messages.create({
      body: data,
      from: '+12058945848',
      to: phoneNumber,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = {
  sendSMS,
};