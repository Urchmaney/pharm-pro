/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');

let service = null;
let newWholesaler = null;
let closeConn = null;

describe(' Wholesaler Service', () => {
  beforeAll(async () => {
    const { wholesalerService, closeConnect, db } = await mongoConnect(global.__MONGO_URI__);
    await db.collection('wholesalers').deleteMany({});
    newWholesaler = (await wholesalerService.addWholesaler({
      fullName: 'Bernad Bakens',
      registrationNumber: '87672',
      phoneNumber: '+2497877823',
    })).result;
    service = wholesalerService;
    closeConn = closeConnect;
  });

  describe('Add Wholesaler', () => {
    it('should fail if required field is missing', async () => {
      const result = await service.addWholesaler({ companyName: 'ui' });
      expect(result.status).toBe(false);
    });

    it('should add wholesaler if field is valid', async () => {
      const { status, result } = await service.addWholesaler(
        {
          fullName: 'Zemus kate',
          registrationNumber: '26dy3',
          phoneNumber: '081672552',
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


  afterAll(async done => {
    closeConn();
    done();
  });
});
