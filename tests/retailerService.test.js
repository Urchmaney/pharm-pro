/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');

let service = null;
let closeConn = null;

beforeAll(async () => {
  const { retailerService, closeConnect } = await mongoConnect(global.__MONGO_URI__);
  service = retailerService;
  closeConn = closeConnect;
});

describe('create retailer', () => {
  it('should create retail if object is valid', async () => {
    const retailer = {
      fullName: 'Zemus kate',
      registrationNumber: '26dy3',
      phoneNumber: '081672552',
    };
    const { status, result } = await service.createRetailer(retailer);
    expect(status).toBe(true);
    expect(result).toBeDefined();
    expect(result.fullName).toBe('Zemus kate');
  });
  it('should not create retailer if object is invalid', async () => {
    let retailer = {};
    let result = await service.createRetailer(retailer);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);

    retailer = { fullName: 'Mathew' };
    result = await service.createRetailer(retailer);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);
  });
});

describe('Is retailer exist by phone Number', () => {
  it('should return true if number exists', async () => {
    await service.createRetailer({
      fullName: 'Zemus kate',
      registrationNumber: '26dy3',
      phoneNumber: '0814577843',
    });
    const result = await service.isRetailerPhoneNumberExist('0814577843');
    expect(result).toBe(true);
  });
  it('should return false if number does not exist', async () => {
    const result = await service.isRetailerPhoneNumberExist('08145745843');
    expect(result).toBe(false);
  });
});


afterAll(done => {
  closeConn();
  done();
});