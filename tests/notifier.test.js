const { sendSMS, sendPushNotification } = require('../src/notification/notifier');

describe.only('Sending SMS', () => {
  it('should send sms for valid number', async () => {
    const result = await sendSMS('6473', '+2348164292882');
    expect(result).toBe(true);
  });
  it('should fail for invalid number', async () => {
    const result = await sendSMS('6473', '+23481292882');
    expect(result).toBe(false);
  });
});

describe('send push notification', () => {
  it('should send notification', async () => {
    const tokens = ['d4mlzmIUQCGTPGjItmpvVB:APA91bE9HNw5WfusErLSaDN9O4xl2Nl5eKEQRBTR4crh4BRQ-0sfURXJlOjbj4h0qPEcVSqnYk4bu0tDbOsja8r7qEJhI21Yb0XG--lr2fPtoHo7NmUiycT-TbzAVRXB9QPHJBH64IIU'];
    const s = await sendPushNotification(tokens, { name: 'data' });
    expect(s).toBe(true);
  });
});