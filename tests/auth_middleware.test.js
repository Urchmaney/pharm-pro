const authenticator = require('../src/authenticator/auth');
const {
  authWholesalerMiddleware, authRetailerMiddleware,
} = require('../src/middlewares/auth_middleware');

const wholesalerAuthMiddleware = authWholesalerMiddleware(authenticator);
const retailerAuthMiddleware = authRetailerMiddleware(authenticator);

let mockRes = null;
beforeEach(() => {
  mockRes = {
    status: (statusCode) => ({ json: () => statusCode }),
  };
});

describe('Wholesaler authenticator middleware', () => {
  it('should return 401 for empty token', () => {
    const mockReq = { headers: {} };
    const result = wholesalerAuthMiddleware(mockReq, mockRes);
    expect(result).toBe(401);
  });
  it('should return 401 for wrong token', () => {
    const mockReq = { headers: { authorization: 'Bearer jwehewyuweyue68763uhwed768we4w78' } };
    const result = wholesalerAuthMiddleware(mockReq, mockRes);
    expect(result).toBe(401);
  });
  it('should return 200 for valid token', () => {
    const token = authenticator.generateAuthToken({ uid: '6gd767', roles: ['WHOLESALER'], type: 1 });
    const mockReq = { headers: { authorization: `Bearer ${token}` } };
    const result = wholesalerAuthMiddleware(mockReq, mockRes, () => 200);
    expect(result).toBe(200);
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.uid).toBe('6gd767');
    expect(mockReq.user.roles.length).toBe(1);
    expect(mockReq.user.type).toBe(1);
  });
});

describe('Retailer authenticator middleware', () => {
  it('should return 401 for empty token', () => {
    const mockReq = { headers: {} };
    const result = retailerAuthMiddleware(mockReq, mockRes);
    expect(result).toBe(401);
  });
  it('should return 401 for wrong token', () => {
    const mockReq = { headers: { authorization: 'Bearer jwehewyuweyue68763uhwed768we4w78' } };
    const result = retailerAuthMiddleware(mockReq, mockRes);
    expect(result).toBe(401);
  });
  it('should return 200 for valid token', () => {
    const token = authenticator.generateAuthToken({ uid: '6gd767', roles: ['WHOLESALER'], type: 2 });
    const mockReq = { headers: { authorization: `Bearer ${token}` } };
    const result = retailerAuthMiddleware(mockReq, mockRes, () => 200);
    expect(result).toBe(200);
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.uid).toBe('6gd767');
    expect(mockReq.user.roles.length).toBe(1);
    expect(mockReq.user.type).toBe(2);
  });
});