/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');

let service = null;
let closeConn = null;

beforeAll(async () => {
  const { reportService, closeConnect } = await mongoConnect(global.__MONGO_URI__);
  service = reportService;
  closeConn = closeConnect;
});

describe('Create report', () => {
  it('Should not create report if it is invalid', async () => {
    let report = '';
    let result = await service.createReport(report);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);

    report = null;
    result = await service.createReport(report);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);

    report = {
      reporter: 'y7667dsaas',
      reportee: 'o78edwyedqw3esw',
      title: 'Wrong goods',
    };
    result = await service.createReport(report);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);
  });
  it('should create report for valid report', async () => {
    const report = {
      reporter: '1f40d73c34ehth00112000f0',
      reporterUserType: 1,
      reportee: '9f42d93c34jhth00228000f0',
      title: 'Wrong goods',
    };
    const { status, result } = await service.createReport(report);
    expect(status).toBe(true);
    expect(typeof result).toBe('object');
    expect(result._id).toBeDefined();
  });
});

afterAll(done => {
  closeConn();
  done();
});