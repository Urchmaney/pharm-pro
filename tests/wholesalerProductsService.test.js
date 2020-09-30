/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');

let service = null;
let testWholesaler = null;
let closeConn = null;
let fService = null;
let pS = null;
let dbase = null;

beforeAll(async () => {
  const {
    wholesalerProductService,
    productService,
    wholesalerService,
    quantityFormService,
    closeConnect,
    db,
  } = await mongoConnect(global.__MONGO_URI__);
  service = wholesalerProductService;

  testWholesaler = (await wholesalerService.createWholesaler({
    fullName: 'Zemus kate',
    registrationNumber: '26dy3',
    phoneNumber: '+2348167255286',
  })).result;
  closeConn = closeConnect;
  pS = productService;
  fService = quantityFormService;
  dbase = db;
});

beforeEach(async () => {
  await dbase.collection('quantityForms').deleteMany({});
  await dbase.collection('wholesalerProducts').deleteMany({});
});

describe('create wholesaler product', () => {
  it('should add product if object is valid', async () => {
    const testProduct = (await pS.createProduct({ name: 'Hamale', medicalName: 'Amalare' })).result;
    const q1 = (await fService.createQuantityForm({ name: 'Box', shortForm: 'Box' })).result._id;
    const q2 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
    const wholesalerProduct = {
      wholesaler: testWholesaler._id,
      product: testProduct._id,
      formPrices: [
        { form: q1, price: 4000, quantity: 2 },
        { form: q2, price: 2500, quantity: 6 },
      ],
    };
    const { status, result } = await service.createWholesalerProduct(wholesalerProduct);
    expect(status).toBe(true);
    expect(result).toBeDefined();
    expect(result.formPrices.find(e => e.form._id.toString() === q1.toString()).price).toBe(4000);
  });
  it('should return null if product Id is valid', async () => {
    const wholesalerProduct = {
      wholesaler: testWholesaler._id,
      product: '823823jedee',
    };
    const { result, status } = await service.createWholesalerProduct(wholesalerProduct);
    expect(status).toBe(false);
    expect(Array.isArray(result)).toBe(true);
  });
  it('should return no Id is valid', async () => {
    const wholesalerProduct = {
      wholesaler: '122139230913',
      product: '123ekdkedek',
    };
    const { result, status } = await service.createWholesalerProduct(wholesalerProduct);
    expect(status).toBe(false);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('wholesaler products', () => {
  it('should return wholesalers product', async () => {
    const wholesalerProducts = await service.getWholesalerProducts(testWholesaler._id);
    expect(wholesalerProducts.length).toBe(1);
    expect(wholesalerProducts[0].product.name).toBeDefined();
  });
});

describe('wholesaler product', () => {
  it('should return product if it exists', async () => {
    const testProduct = (await pS.createProduct({ name: 'Vargil', medicalName: 'Amalare' })).result;
    const q1 = (await fService.createQuantityForm({ name: 'Box', shortForm: 'Box' })).result._id;
    const q2 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
    const nWholesalerProduct = {
      wholesaler: testWholesaler._id,
      product: testProduct._id.toString(),
      formPrices: [
        { form: q1, price: 4000, quantity: 2 },
        { form: q2, price: 2500, quantity: 6 },
      ],
    };
    await service.createWholesalerProduct(nWholesalerProduct);
    const product = await service.getWholesalerProduct(testWholesaler._id, testProduct._id);
    expect(product).toBeDefined();
    expect(product.product.name).toBeDefined();
    expect(product.formPrices.find(e => e.form.toString() === q1.toString()).price).toBe(4000);
    expect(product.formPrices.find(e => e.form.toString() === q2.toString()).price).toBe(2500);
  });
  it('should return null if it does not exist', async () => {
    let product = await service.getWholesalerProduct('ue7edew', 'wiuyqw');
    expect(product).toBeNull();
    product = await service.getWholesalerProduct(testWholesaler._id, 'wiuyqw');
    expect(product).toBeNull();
  });
});

describe('update wholesaler product', () => {
  it('should update wholesaler product if wholesaler and product is valid', async () => {
    const testProduct = (await pS.createProduct({ name: 'Calcimax', medicalName: 'Amalare' })).result;
    const q1 = (await fService.createQuantityForm({ name: 'Box', shortForm: 'Box' })).result._id;
    const q2 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
    const q3 = (await fService.createQuantityForm({ name: 'Satchet', shortForm: 'Scht' })).result._id;
    const q4 = (await fService.createQuantityForm({ name: 'Drip', shortForm: 'Drp' })).result._id;

    const wholesalerProduct = {
      wholesaler: testWholesaler._id,
      product: testProduct._id,
      formPrices: [
        { form: q1, price: 4000, quantity: 2 },
        { form: q2, price: 2500, quantity: 6 },
        { form: q3, price: 50, quantity: 5 },
      ],
    };
    await service.createWholesalerProduct(wholesalerProduct);
    let newObj = { form: q1, price: 2000 };
    let result = await service.updateWholesalerProduct(
      testWholesaler._id, testProduct._id, newObj,
    );
    expect(result).toBeDefined();
    expect(result.formPrices.find(e => e.form.toString() === q1.toString()).price).toBe(2000);
    newObj = { form: q1, price: 2200 };
    result = await service.updateWholesalerProduct(
      testWholesaler._id, testProduct._id, newObj,
    );
    expect(result).toBeDefined();
    expect(result.formPrices.find(e => e.form.toString() === q1.toString()).price).toBe(2200);

    newObj = { form: q4, price: 600 };
    result = await service.updateWholesalerProduct(
      testWholesaler._id, testProduct._id, newObj,
    );
    expect(result).toBeDefined();
    expect(result.formPrices.find(e => e.form.toString() === q4.toString()).price).toBe(600);

    let updatedObj = await service.updateWholesalerProductQuantityTypePrice(
      testWholesaler._id, testProduct._id, q2, 5,
    );
    expect(updatedObj.formPrices.find(e => e.form.toString() === q2.toString()).price).toBe(5);

    updatedObj = await service.updateWholesalerProductQuantityTypePrice(
      testWholesaler._id, testProduct._id, q3, 105,
    );
    expect(updatedObj.formPrices.find(e => e.form.toString() === q2.toString()).price).toBe(5);
    expect(updatedObj.formPrices.find(e => e.form.toString() === q3.toString()).price).toBe(105);
  });
  it('should return null if wholesaler and product is invalid', async () => {
    const newObj = { pricePerBox: 2000 };
    let result = await service.updateWholesalerProduct('rek34kjrkr', newObj);
    expect(result).toBeNull();
    result = await service.updateWholesalerProduct(testWholesaler._id, newObj);
    expect(result).toBeNull();
    result = await service.updateWholesalerProduct('deuid3', newObj);
    expect(result).toBeNull();
  });
});

describe('get wholesaler product cost price', () => {
  it('should get price if present', async () => {
    const q1 = (await fService.createQuantityForm({ name: 'Box', shortForm: 'Box' })).result._id;
    const q2 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
    const q3 = (await fService.createQuantityForm({ name: 'Satchet', shortForm: 'Scht' })).result._id;

    const wholesaler = '9f00d11c43efef01118298f0';
    const product = '5f76d11c34efef00008298f2';
    const wholesalerProduct = {
      wholesaler,
      product,
      formPrices: [
        { form: q1, price: 4000, quantity: 2 },
        { form: q2, price: 2500, quantity: 6 },
        { form: q3, price: 50, quantity: 5 },
      ],
    };
    await service.createWholesalerProduct(wholesalerProduct);
    expect(await service.getWholesalerProductCostPrice(wholesaler, product, q1)).toBe(4000);
    expect(await service.getWholesalerProductCostPrice(wholesaler, product, q2)).toBe(2500);
    expect(await service.getWholesalerProductCostPrice(wholesaler, product, q3)).toBe(50);
    expect(await service.getWholesalerProductCostPrice(wholesaler, product, 'unknwn')).toBe(0);
    expect(await service.getWholesalerProductCostPrice('fwfcwefcwd', product, 'Satchet')).toBe(0);
  });
});

test('get wholesalers product by group by medical name', async () => {
  const q1 = (await fService.createQuantityForm({ name: 'Box', shortForm: 'Box' })).result._id;
  const q2 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
  const q3 = (await fService.createQuantityForm({ name: 'Satchet', shortForm: 'Scht' })).result._id;

  const testProduct = (await pS.createProduct({ name: 'Zinat', medicalName: 'Worm' })).result;
  const wholesalerProduct = {
    wholesaler: testWholesaler._id,
    product: testProduct._id,
    formPrices: [
      { form: q2, price: 100 },
      { form: q1, price: 1000 },
      { form: q3, price: 100 },
    ],
  };
  await service.createWholesalerProduct(wholesalerProduct);
  const groupProducts = await service.getWholesalerProductsByGroups(testWholesaler._id);
  expect(groupProducts.length).toBe(2);
});

afterAll(done => {
  closeConn();
  done();
});