/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../../src/data_access/connect');
const authenticator = require('../../src/authenticator/auth');
const notifier = require('../../src/notification/notifier');
const wholesalerControllerGenerator = require('../../src/controllers/wholesalerController');

let closeConn = null;
let wholesaler = null;

let dbObj = null;
let service = null;

let create = null;
let index = null;
let update = null;
let show = null;
let deleteAction = null;
let generateAndSendOTP = null;
let uploadProfileImage = null;

beforeAll(async () => {
  const {
    wholesalerService, otpService, closeConnect, db,
  } = await mongoConnect(global.__MONGO_URI__);

  dbObj = db;
  service = wholesalerService;
  closeConn = closeConnect;

  const wholesalerController = wholesalerControllerGenerator(wholesalerService,
    otpService, authenticator, notifier);

  create = wholesalerController.create;
  index = wholesalerController.index;
  update = wholesalerController.update;
  show = wholesalerController.show;
  deleteAction = wholesalerController.deleteAction;
  generateAndSendOTP = wholesalerController.generateAndSendOTP;
  uploadProfileImage = wholesalerController.uploadProfileImage;
});

beforeEach(async () => {
  await dbObj.collection('wholesalers').deleteMany({});
  wholesaler = (await service.createWholesaler({
    fullName: 'Mr Lukemon Agbado',
    registrationNumber: '87672',
    phoneNumber: '+2497877823',
  })).result;
});

describe('wholesaler controller create action', () => {
  it('should return status code 200 for valid wholesaler', async () => {
    const wholesaler = { phoneNumber: '+23481473863', fullName: 'Mango Orange', registrationNumber: '3323' };
    const { statusCode, result } = await create.action(wholesaler);
    expect(statusCode).toBe(201);
    expect(result).toBeDefined();
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

describe('wholesaler controller show action', () => {
  it('should return 200 wholesaler if wholesaler exists', async () => {
    const { statusCode, result } = await show.action(wholesaler._id);
    expect(statusCode).toBe(200);
    expect(result).toBeDefined();
    expect(result._id).toMatchObject(wholesaler._id);
  });
  it('should return 400 if id does not exists', async () => {
    const { statusCode, result } = await show.action('8csdjuu8dzsdsdsd');
    expect(statusCode).toBe(404);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});

describe('wholesaler controller update action', () => {
  it('should return 400 if id does not exists', async () => {
    const { statusCode, result } = await update.action('8csdjuu8dzsdsdsd', {});
    expect(statusCode).toBe(400);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
  it('should return 200 and update if id exist', async () => {
    const { statusCode, result } = await update.action(wholesaler._id, { fullName: 'Mick June' });
    expect(statusCode).toBe(200);
    expect(result).toBeDefined();
    expect(result.fullName).toBe('Mick June');
  });
});

describe('wholesaler generate and send OTP', () => {
  it('should not send OTP if phoneNumber is wrong', async () => {
    const phoneNumber = '+23481348534';
    const { statusCode } = await generateAndSendOTP.action(phoneNumber);
    expect(statusCode).toBe(400);
  });
  it('should send OTP if phoneNumber is valid', async () => {
    const phoneNumber = '+2348164292882';
    const { statusCode } = await generateAndSendOTP.action(phoneNumber);
    expect(statusCode).toBe(200);
  });
});

describe('wholesaler upload profile image', () => {
  it('should return status code 400 if wholesaler is not found', async () => {
    const wholesalerId = 'de';
    const profileImage = {
      contentType: 'image/png',
      path: '../uploads/profile_image.png',
    };
    const { statusCode } = await uploadProfileImage.action(wholesalerId, profileImage);
    expect(statusCode).toBe(400);
  });
  it('should return status code 400 if image is not defined', async () => {
    const profileImage = null;
    const { statusCode } = await uploadProfileImage.action('', profileImage);
    expect(statusCode).toBe(400);
  });
  it('should return 200 status code if image is defined and wholesaler is found', async () => {
    const wholesalerId = wholesaler._id;
    const profileImage = {
      contentType: 'image/png',
      path: './uploads/profile_image.png',
    };
    const { statusCode, result } = await uploadProfileImage.action(wholesalerId, profileImage);
    expect(result).toBeDefined();
    expect(result.profileImage).toBeDefined();
    expect(statusCode).toBe(200);
  });
});

describe('wholesaler controller delete action', () => {
  it('should delete wholesaler', async () => {
    const id = wholesaler._id;
    const result = await deleteAction.action(id);
    expect(result.statusCode).toBe(200);
    const { statusCode } = await show.action(id);
    expect(statusCode).toBe(404);
  });
});

afterAll(done => {
  closeConn();
  done();
});
