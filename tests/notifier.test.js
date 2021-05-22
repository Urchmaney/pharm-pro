const { sendSMS, sendPushNotification, sendOTP } = require('../src/notification/notifier');

describe('Sending SMS', () => {
  it('should send sms for valid number', async () => {
    const result = await sendSMS('6473', '+2348164292882');
    expect(result).toBe(true);
  });
  it('should fail for invalid number', async () => {
    const result = await sendSMS('6473', '+23481292882');
    expect(result).toBe(false);
  });
});

describe.only('send push notification', () => {
  it('should send notification', async () => {
    const tokens = ['ckJ3OdHdaCg:APA91bF4k2GTs41feJ79jlehTyFMkx5bjCoQAG_6F5TgxmjYCQn2-hiLHLrDtV2Kg6EaV3to7UuBuX-drq-ICr2a6ot-uiplUMxKeT1AUe0rAmvpsXZ1qC0GWcTRCi2A7dzOZ7vjGZKV'];
    const s = await sendPushNotification(tokens, { name: 'data' }, 'The Note', 'Welcome Home');
    expect(s).toBe(true);
  });
});

describe('Send OTP using Termil', () => {
  it('should return the OTP ID', async () => {
    const phoneNumber = '2348164292882';
    const result = await sendOTP(phoneNumber, '47632');
    expect(result).toBe(true);
  });
});