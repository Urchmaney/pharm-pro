const authMiddleware = (authenticator) => (
  (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers.authorization || '';
    if (!token) return res.status(401).json('Access denied. No token provided.');
    [, token] = token.split(' ');
    req.user = authenticator.verifyAuthToken(token);
    if (!req.user) return res.status(400).json('Invalid token.');
    return next();
  });

module.exports = authMiddleware;
