const authenticator = require('../src/authenticator/auth');
const authMiddleware = require('../src/middlewares/auth_middleware')(authenticator);

describe('Authenticator middleware', () => {
  let mockRes = null;
  beforeEach(() => {
    mockRes = {
      status: (statusCode) => ({ json: () => statusCode }),
    };
  });

  it('should return 401 for empty token', () => {
    const mockReq = { headers: {} };
    const result = authMiddleware(mockReq, mockRes);
    expect(result).toBe(401);
  });
  it('should return 400 for wrong token', () => {
    const mockReq = { headers: { authorization: 'Bearer jwehewyuweyue68763uhwed768we4w78' } };
    const result = authMiddleware(mockReq, mockRes);
    expect(result).toBe(400);
  });
  it('should return 200 for valid token', () => {
    const token = authenticator.generateAuthToken({ uid: '6gd767', roles: ['WHOLESALER'] });
    const mockReq = { headers: { authorization: `Bearer ${token}` } };
    const result = authMiddleware(mockReq, mockRes, () => 200);
    expect(result).toBe(200);
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user.uid).toBe('6gd767');
    expect(mockReq.user.roles.length).toBe(1);
  });
});