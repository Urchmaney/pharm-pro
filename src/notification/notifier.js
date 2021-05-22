require('dotenv').config();
const twilio = require('twilio');
const axios = require('axios');

const { firebaseAdmin } = require('../firebase/index');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const TERMIL_SEND_URL = 'https://termii.com/api/sms/send';

// const sendOTP = async (phoneNumber, otp) => {
//   try {
//     const result = await axios.post(TERMIL_SEND_URL, {
//       api_key: process.env.TERMII_API_KEY,
//       message_type: 'NUMERIC',
//       to: phoneNumber,
//       from: 'N-Alert',
//       channel: 'dnd',
//       pin_attempts: '10',
//       pin_time_to_live: '5',
//       pin_length: '5',
//       pin_placeholder: '< 1234 >',
//       message_text: `Your login pin is :  ${otp}`,
//       pin_type: 'NUMERIC',
//     });
//     console.log(result);
//     return true;
//   } catch (e) {
//     console.log(e);
//     console.log('Error sending otp');
//     return false;
//   }
// };

const sendOTP = async (phoneNumber, otp) => {
  try {
    if (process.env.ENVIRONMENT !== 'production') return true;
    const result = await axios.post(TERMIL_SEND_URL, {
      api_key: process.env.TERMII_API_KEY,
      to: phoneNumber,
      from: 'N-Alert',
      channel: 'generic',
      type: 'plain',
      sms: `Your login pin is :  ${otp}`,
    });
    console.log(result);
    return true;
  } catch (e) {
    console.log(e);
    console.log('Error sending otp');
    return false;
  }
};

const sendSMS = async (data, phoneNumber) => {
  try {
    await client.messages.create({
      body: data,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    return true;
  } catch (e) {
    return false;
  }
};

const sendPushNotification = async (userTokens, data, title, body) => {
  try {
    Object.assign(data, {
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
      title,
      body,
    });
    const message = {
      notification: {
        // clickAction: 'FLUTTER_NOTIFICATION_CLICK',
        title,
        body,
      },
      priority: 'high',
      data,
      tokens: userTokens,
    };
    const result = await firebaseAdmin.messaging().sendMulticast(message);
    console.log(result);
    console.log(result.responses[0].error);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = {
  sendSMS,
  sendOTP,
  sendPushNotification,
};