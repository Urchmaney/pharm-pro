const { sendSMS } = require('../src/notification/notifier');

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