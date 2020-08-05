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
      phoneNumber: '+2348167255244',
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
      phoneNumber: '+2348145778433',
    });
    const result = await service.isRetailerPhoneNumberExist('+2348145778433');
    expect(result).toBe(true);
  });
  it('should return false if number does not exist', async () => {
    const result = await service.isRetailerPhoneNumberExist('+23481457458433');
    expect(result).toBe(false);
  });
});

describe('Get retailer by Id', () => {
  it('should return null if Id does not exist', async () => {
    let id = '83jh339dujdujd';
    let result = await service.getRetailer(id);
    expect(result).toBeNull();

    id = {};
    result = await service.getRetailer(id);
    expect(result).toBeNull();

    id = '';
    result = await service.getRetailer(id);
    expect(result).toBeNull();

    id = 'djkeyuedhe';
    result = await service.getRetailer(id);
    expect(result).toBeNull();
  });
  it('should return retailer if id exists', async () => {
    const { result } = await service.createRetailer({
      fullName: 'Zemus kate',
      registrationNumber: '26dy3',
      phoneNumber: '+2348145778439',
    });
    const retailer = await service.getRetailer(result._id);
    expect(retailer).toBeDefined();
    expect(retailer._id).toMatchObject(result._id);
  });
});

describe('Update retailer', () => {
  it('should return null if id is not exists', async () => {
    const updates = {
      fullName: 'Amake lukes',
    };
    const id = '9344dedeidejde';
    const result = await service.updateRetailer(id, updates);
    expect(result).toBeNull();
  });
  it('should update and return updated value', async () => {
    const { result } = await service.createRetailer({
      fullName: 'Menopause luna',
      registrationNumber: '26dy3',
      phoneNumber: '+2348146668433',
    });
    let updates = {
      fullName: 'Amake lukes',
    };
    let updatedResult = await service.updateRetailer(result._id, updates);
    expect(updatedResult).toBeDefined();
    expect(updatedResult.fullName).toBe(updates.fullName);

    updates = {
      name: 'Bullocks john',
    };
    updatedResult = await service.updateRetailer(result._id, updates);
    expect(updatedResult).toBeDefined();
    expect(updatedResult.name).not.toBeDefined();
  });
});

describe('Get all retailer', () => {
  it('should return all retailers', async () => {
    const retailers = await service.getRetailers();
    expect(Array.isArray(retailers)).toBe(true);
    expect(retailers.length).toBe(4);
  });
});

afterAll(done => {
  closeConn();
  done();
});