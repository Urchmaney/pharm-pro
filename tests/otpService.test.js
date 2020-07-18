/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');

let service = null;
let closeConn = null;

beforeAll(async () => {
  const { otpService, closeConnect } = await mongoConnect(global.__MONGO_URI__);
  service = otpService;
  closeConn = closeConnect;
});

describe('create otp', () => {
  it('should return null if userId is not defined or userType is invalid', async () => {
    let otp = await service.createOTP();
    expect(otp).toBeNull();
    otp = await service.createOTP('', 1);
    expect(otp).toBeNull();
    otp = await service.createOTP('+23481642733', 3);
    expect(otp).toBeNull();
  });
  it('should create otp if userId and userType is defined', async () => {
    const otp = await service.createOTP('+234816423422', 2);
    expect(otp).toBeDefined();
    expect(otp.length).toBe(5);
  });
});

describe('get otp', () => {
  it('should return null if user otp does not existe', async () => {
    const otp = await service.getOTP('+2348164212223', 1);
    expect(otp).toBeNull();
  });
  it('should return null if user otp does not exist cause type diff', async () => {
    const phoneNumber = '+234814672833';
    await service.createOTP(phoneNumber, 1);
    const otp = await service.getOTP(phoneNumber, 2);
    expect(otp).toBeNull();
  });
  it('should return otp', async () => {
    const phoneNumber = '+23481277464';
    const otp = await service.createOTP(phoneNumber, 1);
    const otpGet = await service.getOTP(phoneNumber, 1);
    expect(otpGet).toBeDefined();
    expect(otpGet.otp).toBe(otp);
  });
});

describe('delete otp', () => {
  it('delete all user otp', async () => {
    const phoneNumber = '+2348164273433';
    const userType = 2;
    await service.createOTP(phoneNumber, userType);
    await service.createOTP(phoneNumber, userType);
    await service.deleteOTP(phoneNumber, userType);
    const otp = await service.getOTP(phoneNumber, userType);
    expect(otp).toBeNull();
  });
});

describe('validate otp', () => {
  it('should should return false for wrong details', async () => {
    const phoneNumber = '+234816376644';
    const userType = 2;
    const otp = await service.createOTP(phoneNumber, userType);
    let valid = await service.validateOTP(phoneNumber, userType, otp,
      new Date().setMinutes((new Date()).getMinutes() + 11));
    expect(valid).toBe(false);
    valid = await service.validateOTP(phoneNumber, 1, otp, new Date());
    expect(valid).toBe(false);
    valid = await service.validateOTP('+2348146733', userType, otp, new Date());
    expect(valid).toBe(false);
  });
  it('should return true for valid details', async () => {
    const phoneNumber = '+234816488474';
    const userType = 1;
    let otp = await service.createOTP(phoneNumber, userType);
    let valid = await service.validateOTP(phoneNumber, userType, otp,
      new Date().setMinutes((new Date()).getMinutes() + 7));
    expect(valid).toBe(true);
    otp = await service.createOTP(phoneNumber, userType);
    valid = await service.validateOTP(phoneNumber, userType, otp, new Date());
    expect(valid).toBe(true);
    otp = await service.createOTP(phoneNumber, userType);
    valid = await service.validateOTP(phoneNumber, userType, otp,
      new Date().setMinutes((new Date()).getMinutes() + 3));
    expect(valid).toBe(true);
  });
});


afterAll(async done => {
  closeConn();
  done();
});