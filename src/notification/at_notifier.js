const axios = require('axios');

const sendSMS = async (data, phoneNumber) => {
  try {
    const result = await axios.post('https://api.sandbox.africastalking.com/version1/messaging', {
      to: phoneNumber,
      message: data,
      from: '2334',
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        apiKey: 'c9fb154718d7128d0a4d3b68f497b1ec4e2ed3bccea123e24a201a897916b2f2',
        username: 'Sandbox',
      },
    });
    console.log(result);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = {
  sendSMS,
};
