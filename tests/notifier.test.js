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
    const tokens = ['esLOJm1JRYStjDf3wLVOtu:APA91bEGkasBycI0NbhLwch_yTjlkMkaHp42TnBqiJoK2WrPQbIfga0VTdR69YnQbbBLF66cMZaQXvDNZSLGhXTjEp79GwPDZE17o6j4kZ3S-aL-3NGRS6YTG4aBrhIZwjf4qT5C_6ma'];
    const s = await sendPushNotification(tokens, { name: 'data' });
    expect(s).toBe(true);
  });
});