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

describe('Get retailer by phone number', () => {
  it('should return retailer if phone number exists', async () => {
    const retailer = await service.getRetailerByPhoneNumber('+2348145778433');
    expect(retailer).toBeDefined();
    expect(retailer.phoneNumber).toBe('+2348145778433');
  });
  it('should return null if phone number does not exist', async () => {
    const retailer = await service.getRetailerByPhoneNumber('+2348135778433');
    expect(retailer).toBeNull();
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

describe('Add and remove retailer Token', () => {
  it('should add and remove retailer token', async () => {
    let retailerM = (await service.createRetailer({
      fullName: 'Zemus kate',
      registrationNumber: '26dy3',
      phoneNumber: '+2348145778445',
    })).result;
    expect(retailerM.tokens.length).toBe(0);
    retailerM = await service.addRetailerToken(retailerM._id, 'New oken fton');
    expect(retailerM.tokens.length).toBe(1);
    retailerM = await service.addRetailerToken(retailerM._id, 'Another New oken fton');
    expect(retailerM.tokens.length).toBe(2);
    retailerM = await service.addRetailerToken(retailerM._id, 'New oken fton');
    expect(retailerM.tokens.length).toBe(2);

    retailerM = await service.removeRetailerToken(retailerM._id, 'Another New oken fton');
    expect(retailerM.tokens.length).toBe(1);
    retailerM = await service.removeRetailerToken(retailerM._id, 'Wrong token');
    expect(retailerM.tokens.length).toBe(1);
  });
});

describe('Add retailer wholesaler', () => {
  it('should not add retailer wholesaler object is invalid', async () => {
    let retailerWholesaler = '';
    let result = await service.addRetailerWholesaler(retailerWholesaler);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);

    retailerWholesaler = {};
    result = await service.addRetailerWholesaler(retailerWholesaler);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);

    retailerWholesaler = {
      retailerId: '6776765676',
    };
    result = await service.addRetailerWholesaler(retailerWholesaler);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);

    retailerWholesaler = {
      retailerId: '6776765676',
      phoneNumber: '+2348164292882',
    };
    result = await service.addRetailerWholesaler(retailerWholesaler);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);

    retailerWholesaler = {
      retailerId: '6776765676',
      phoneNumber: '+2348164292882',
      active: true,
    };
    result = await service.addRetailerWholesaler(retailerWholesaler);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);

    retailerWholesaler = {
      retailerId: '6776765676',
      phoneNumber: '+2348164292882',
      fullName: 'Abdul Musa',
    };
    result = await service.addRetailerWholesaler(retailerWholesaler);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);
  });
  it('should add retailer wholesaler', async () => {
    const retailerWholesaler = {
      retailerId: '6776765676',
      phoneNumber: '+2348164292882',
      wholesalerId: null,
      active: true,
      fullName: 'Abdul Musa',
    };
    const { status, result } = await service.addRetailerWholesaler(retailerWholesaler);
    expect(status).toBe(true);
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });
});

describe('Get all retailers wholesalers', () => {
  it('should return all retailer wholesalers', async () => {
    const retailerId = '6776765676';
    const retailerWholesalers = await service.getRetailerWholesalers(retailerId);
    expect(retailerWholesalers.length).toBe(1);
  });
});

describe('Get single retailer wholesaler', () => {
  it('should return a retailer wholesaler if exists', async () => {
    const phoneNumber = '+2348164292882';
    const retailerId = '6776765676';
    const retailerWholesaler = await service.getRetailerWholesalerByPhoneNumber(
      retailerId, phoneNumber,
    );
    expect(retailerWholesaler).toBeDefined();
    expect(retailerWholesaler.fullName).toBe('Abdul Musa');
  });
  it('should return null if retailer wholesaler does not exists', async () => {
    const retailerWholesaler = await service.getRetailerWholesalerByPhoneNumber('jhyu76ed', '+2348164292882');
    expect(retailerWholesaler).toBeNull();
  });
});

describe('Update retailer wholesaler', () => {
  it('should update only the phoneNumber and full name', async () => {
    const oldObj = (await service.addRetailerWholesaler({
      retailerId: '875877493722',
      phoneNumber: '+2348164292882',
      fullName: 'Mike emeka',
      active: false,
    })).result;
    const updateObj = {
      phoneNumber: '+2348064292882',
      fullName: 'Luke emeka',
      active: true,
    };
    const updatedObj = await service.updateRetailerWholesaler(oldObj._id, updateObj);
    expect(updatedObj.fullName).toBe(updateObj.fullName);
    expect(updatedObj.phoneNumber).toBe(updateObj.phoneNumber);
    expect(updatedObj.active).toBe(false);
  });
  it('should return null if Id does not exists', async () => {
    const updateObj = {
      phoneNumber: '+2348064292882',
      fullName: 'Luke emeka',
      active: true,
    };
    const updatedObj = await service.updateRetailerWholesaler('87623323hwdwe', updateObj);
    expect(updatedObj).toBeNull();
  });
});

afterAll(done => {
  closeConn();
  done();
});