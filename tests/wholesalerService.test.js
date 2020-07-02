const mongoConnect = require('../src/data-access/connect');

let service = null;
let closeConn = null;

beforeAll(async () => {
  // eslint-disable-next-line no-underscore-dangle
  const { wholesalerService, closeConnect } = await mongoConnect(global.__MONGO_URI__);
  service = wholesalerService;
  closeConn = closeConnect;
});

describe('Wholesaler', () => {
  it('should fail if required field is missing', async () => {
    const result = await service.addWholesaler({ companyName: 'ui' });
    expect(result.status).toBe(false);
  });
});

afterAll(done => {
  closeConn();
  done();
});
