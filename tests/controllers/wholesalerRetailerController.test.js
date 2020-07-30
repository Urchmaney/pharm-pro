/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../../src/data_access/connect');
const wholesalerRetaierControllerGenerator = require('../../src/controllers/wholesalerRetailerController');

let create = null;

let closeConn = null;

beforeAll(async () => {
  const {
    wholesalerService, closeConnect, retailerService,
  } = await mongoConnect(global.__MONGO_URI__);

  closeConn = closeConnect;

  const controller = wholesalerRetaierControllerGenerator(wholesalerService, retailerService);
  create = controller.create;
});

describe('create action', () => {
  it('should return 400 if content if object is invalid', async () => {
    let wholesalerRetailer = {
      wholesalerId: '8237edjhehef9e49',
      fullName: 'Memka Jude',
    };
    let result = await create.action(wholesalerRetailer);
    expect(result.statusCode).toBe(400);
    expect(result.result).toBeDefined();
    expect(Array.isArray(result.result)).toBe(true);

    wholesalerRetailer = {
      wholesalerId: 'eweuiyuwer2383',
      phoneNumber: '08164729993',
    };
    result = await create.action(wholesalerRetailer);
    expect(result.statusCode).toBe(400);
    expect(result.result).toBeDefined();
    expect(Array.isArray(result.result)).toBe(true);

    wholesalerRetailer = {};
    result = await create.action(wholesalerRetailer);
    expect(result.statusCode).toBe(400);
    expect(result.result).toBeDefined();
    expect(Array.isArray(result.result)).toBe(true);

    wholesalerRetailer = '';
    result = await create.action(wholesalerRetailer);
    expect(result.statusCode).toBe(400);
    expect(result.result).toBeDefined();
    expect(Array.isArray(result.result)).toBe(true);

    wholesalerRetailer = null;
    result = await create.action(wholesalerRetailer);
    expect(result.statusCode).toBe(400);
    expect(result.result).toBeDefined();
    expect(Array.isArray(result.result)).toBe(true);
  });

  it('should return 201 if it is valid', async () => {
    const wholesalerRetailer = {
      wholesalerId: 'deihde382r3fdhe4j',
      fullName: 'Mike Adenuga',
      phoneNumber: '080675646632',
    };
    const { statusCode, result } = await create.action(wholesalerRetailer);
    expect(statusCode).toBe(201);
    expect(result).toBeDefined();
    expect(result.active).toBe(false);
  });
});

afterAll(done => {
  closeConn();
  done();
});