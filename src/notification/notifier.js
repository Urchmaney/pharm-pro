require('dotenv').config();
const twilio = require('twilio');
const firebaseAdmin = require('firebase-admin');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

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

const sendPushNotification = async (userTokens, data) => {
  try {
    const message = {
      data,
      tokens: userTokens,
    };
    await firebaseAdmin.messaging().sendMulticast(message);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = {
  sendSMS,
  sendPushNotification,
};