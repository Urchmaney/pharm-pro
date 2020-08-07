const authWholesalerMiddleware = (authenticator) => (
  (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers.authorization || '';
    if (!token) return res.status(401).json('Access denied. No token provided.');
    if (token[0] === 'B') [, token] = token.split(' ');
    req.user = authenticator.verifyAuthToken(token);
    if (!req.user || req.user.type !== 1) return res.status(401).json('Invalid token.');
    return next();
  });

const authRetailerMiddleware = (authenticator) => (
  (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers.authorization || '';
    if (!token) return res.status(401).json('Access denied. No token provided.');
    if (token[0] === 'B') [, token] = token.split(' ');
    req.user = authenticator.verifyAuthToken(token);
    if (!req.user || req.user.type !== 2) return res.status(401).json('Invalid token.');
    return next();
  });

module.exports = {
  authRetailerMiddleware,
  authWholesalerMiddleware,
};
