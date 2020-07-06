const {
  hashPassword,
  verifyPassword,
  generateAuthToken,
  verifyAuthToken,
  generateOTP,
} = require('../src/authenticator/auth');

describe('Passsord Hashing', () => {
  it('should generate a password hash string', () => {
    const password = 'Z6dhhdy6';
    const result = hashPassword(password);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(20);
  });
  it('should return false if passwords are different', () => {
    const password = '7fhjsid56';
    const hash = hashPassword(password);
    const inputedPassword = '676dwee ';
    const result = verifyPassword(inputedPassword, hash);
    expect(result).toBe(false);
  });
  it('should return true if passwords are same', () => {
    const password = 'jehqyujhse';
    const hash = hashPassword(password);
    const inputedPassword = 'jehqyujhse';
    const result = verifyPassword(inputedPassword, hash);
    expect(result).toBe(true);
  });
});

describe('Generating authentication token', () => {
  it('should generate a token', () => {
    const token = generateAuthToken({ uid: 'u6dhhs6ss', role: ['RETAILER'] });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(30);
  });
  it('should verify and return all token details for valid token', () => {
    const token = generateAuthToken({ uid: 'u6dewdhhs6ss', role: ['RETAILER'] });

    const result = verifyAuthToken(token);
    expect(result.uid).toBe('u6dewdhhs6ss');
    expect(Array.isArray(result.role)).toBe(true);
    expect(result.role.length).toBe(1);
  });
  it('should return null if token is invalid', () => {
    const token = 'eduiweudyebwdjiwebjoieiwufbweiufwiefciwegydyuwebwvdfuywevbiywe';

    const result = verifyAuthToken(token);
    expect(result).toBeNull();
  });
});

describe('Generating OTP', () => {
  it('should be defined and of length 4', () => {
    const OTP = generateOTP();
    expect(OTP).toBeDefined();
    expect(OTP.length).toBe(4);
  });
});