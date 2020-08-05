/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');

let service = null;
let newWholesaler = null;
let closeConn = null;

describe(' Wholesaler Service', () => {
  beforeAll(async () => {
    const { wholesalerService, closeConnect, db } = await mongoConnect(global.__MONGO_URI__);
    await db.collection('wholesalers').deleteMany({});
    newWholesaler = (await wholesalerService.createWholesaler({
      fullName: 'Bernad Bakens',
      registrationNumber: '87672',
      phoneNumber: '+2349078778256',
    })).result;
    service = wholesalerService;
    closeConn = closeConnect;
  });


  describe('Create Wholesaler', () => {
    it('should fail if required field is missing', async () => {
      const result = await service.createWholesaler({ companyName: 'ui' });
      expect(result.status).toBe(false);
    });

    it('should add wholesaler if field is valid', async () => {
      const { status, result } = await service.createWholesaler(
        {
          fullName: 'Zemus kate',
          registrationNumber: '26dy3',
          phoneNumber: '+2348167255267',
        },
      );
      expect(status).toBe(true);
      expect(result._id).toBeDefined();
    });
  });


  describe('Get wholesaler', () => {
    it('should return wholesaler if found', async () => {
      const saler = await service.getWholesalerById(newWholesaler._id);
      expect(saler).toBeDefined();
      expect(saler.licenseNumber).toBe(newWholesaler.licenseNumber);
    });

    it('should return null if not found', async () => {
      const saler = await service.getWholesalerById('5eff96ca288968187b7d8d88');
      expect(saler).toBeNull();
    });
  });


  describe('Update wholesaler', () => {
    it('should update wholesaler', async () => {
      const saler = await service.updateWholesaler(newWholesaler._id,
        {
          licenseNumber: '2976281',
          companyName: 'Lux',
        });
      expect(saler.licenseNumber).toBe('2976281');
      expect(saler.companyName).toBe('Lux');
    });
    it('should update only new properties', async () => {
      const saler = await service.updateWholesaler(newWholesaler._id,
        {
          licenseNumber: '4556768',
        });
      expect(saler.licenseNumber).toBe('4556768');
      expect(saler.companyName).toBe('Lux');
    });
  });


  describe('Delete wholesaler', () => {
    it('should delete wholesaler', async () => {
      await service.deleteWholesaler(newWholesaler._id);
      expect(await service.getWholesalerById(newWholesaler._id)).toBeNull();
    });
  });


  describe('All wholesalers', () => {
    it('should return array of wholesalers', async () => {
      const wholesalers = await service.getWholesalers();
      expect(Array.isArray(wholesalers)).toBe(true);
    });
  });


  describe('Get wholesaler by phone number', () => {
    it('should return wholesaler if number is in db', async () => {
      const phoneNumber = '+2349078778256';
      const result = await service.getWholesalerByPhoneNumber(phoneNumber);
      expect(result).toBeDefined();
      expect(result._id).toMatchObject(newWholesaler._id);
    });
    it('should return null if number is not in db', async () => {
      const phoneNumber = '+2349054378256';
      const result = await service.getWholesalerByPhoneNumber(phoneNumber);
      expect(result).toBeNull();
    });
  });


  describe('create Wholesaler Retailers', () => {
    it('should create wholesaler retailer if first name is present', async () => {
      const wholesalerRetailer = {
        wholesalerId: newWholesaler._id,
        phoneNumber: '+2348034567123',
        fullName: 'Memga',
        active: true,
      };
      const { status, result } = await service.createWholesalerRetailer(wholesalerRetailer);
      expect(status).toBe(true);
      expect(result).toBeDefined();
    });

    it('should fail if first name or phone number is empty', async () => {
      const wholesalerRetailer = {
        wholesalerId: newWholesaler._id,
        phoneNumber: '',
        fullName: 'Memga',
      };
      const { status, result } = await service.createWholesalerRetailer(wholesalerRetailer);
      expect(status).toBe(false);
      expect(Array.isArray(result)).toBe(true);
    });
  });


  describe('Get wholesaler Retailers', () => {
    it('should return the wholesaler retailers', async () => {
      const wRetailers = await service.getWholesalerRetailers(newWholesaler._id);
      expect(wRetailers.length).toBe(1);
    });
  });


  describe('Get wholesaler retailer', () => {
    it('should return wholesaeler retailer if it exists', async () => {
      const phoneNumber = '+2348034567123';
      const retailer = await service.getWholesalerRetailer(newWholesaler._id, phoneNumber);
      expect(retailer).toBeDefined();
      expect(retailer.phoneNumber).toBe(phoneNumber);
    });
    it('should return null if it does not exist', async () => {
      const retailer = await service.getWholesalerRetailer('jededewodqe', '08145332233');
      expect(retailer).toBeNull();
    });
  });


  describe('Update wholesaler retailer', () => {
    it('should update wholesaler retailer if valid', async () => {
      const oldWholeRetailer = (await service.createWholesalerRetailer({
        fullName: 'Menga man',
        wholesalerId: '1e03ujde3d',
        phoneNumber: '+234906535533',
        active: false,
      })).result;
      const newWholeRetailer = {
        fullName: 'new Man',
      };
      const updateObj = await service.updateWholesalerRetailer(
        oldWholeRetailer._id, newWholeRetailer,
      );
      expect(updateObj).toBeDefined();
      expect(updateObj.fullName).toBe('new Man');
      expect(updateObj.phoneNumber).toBe('+234906535533');
    });

    it('should return null if _id is invalid', async () => {
      const newWholeRetailer = {
        fullName: 'Menga man',
        phoneNumber: '+234906535533',
      };
      const updateObj = await service.updateWholesalerRetailer(
        'dfjdiusdsd', newWholeRetailer,
      );
      expect(updateObj).toBeNull();
    });
  });

  afterAll(async done => {
    closeConn();
    done();
  });
});
