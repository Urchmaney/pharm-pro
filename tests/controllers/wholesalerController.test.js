/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../../src/data_access/connect');
const authenticator = require('../../src/authenticator/auth');
const wholesalerControllerGenerator = require('../../src/controllers/wholesalerController');

let closeConn = null;

let create = null;
let index = null;

beforeAll(async () => {
  const { wholesalerService, closeConnect } = await mongoConnect(global.__MONGO_URI__);
  closeConn = closeConnect;
  const wholesalerController = wholesalerControllerGenerator(wholesalerService, authenticator);
  create = wholesalerController.create;
  index = wholesalerController.index;
});

describe('wholesaler controller create action', () => {
  it('should return status code 200 for valid wholesaler', async () => {
    const wholesaler = { phoneNumber: '+23481473863', fullName: 'Mango Orange', registrationNumber: '3323' };
    const { statusCode, result } = await create.action(wholesaler);
    expect(statusCode).toBe(200);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
  it('should return status code of 400 for invalid wholesaler', async () => {
    const wholesaler = {};
    const { statusCode, result } = await create.action(wholesaler);
    expect(statusCode).toBe(400);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('wholesaler controller index action', () => {
  it('should return status code 200 and wholesaler list', async () => {
    const { statusCode, result } = await index.action();
    expect(statusCode).toBe(200);
    expect(result.length).toBe(1);
  });
});


afterAll(done => {
  closeConn();
  done();
});
