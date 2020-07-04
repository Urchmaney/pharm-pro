const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'PUT IN ENV';
const ISSUER = 'pharm - pro';

const hashPassword = (password) => bcrypt.hashSync(password, 10);

const verifyPassword = (password, hash) => bcrypt.compareSync(password, hash);

const generateAuthToken = (payload) => {
  const options = {
    expiresIn: 24 * 60 * 60,
    issuer: ISSUER,
  };
  return jwt.sign(payload, SECRET_KEY, options);
};

const verifyAuthToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY, { issuer: ISSUER });
  } catch (e) {
    return null;
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateAuthToken,
  verifyAuthToken,
};
