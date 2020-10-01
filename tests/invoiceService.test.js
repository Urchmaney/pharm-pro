/* eslint-disable no-underscore-dangle */
const { v4 } = require('uuid');
const mongoConnect = require('../src/data_access/connect');


let service = null;
let wpService = null;
let wService = null;
let pService = null;
let fService = null;
let closeConn = null;
let dbase = null;

beforeAll(async () => {
  const {
    invoiceService,
    wholesalerProductService,
    productService,
    wholesalerService,
    quantityFormService,
    db,
    closeConnect,
  } = await mongoConnect(global.__MONGO_URI__);
  service = invoiceService;
  wpService = wholesalerProductService;
  pService = productService;
  wService = wholesalerService;
  fService = quantityFormService;
  closeConn = closeConnect;
  dbase = db;
});

beforeEach(async () => {
  await dbase.collection('quantityForms').deleteMany({});
});

describe('Create Invoice', () => {
  it('should return error if invoice is invalid', async () => {
    let invoice = {};
    let result = await service.createInvoice(invoice);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);

    invoice = { retailer: 'cyuwewe' };
    result = await service.createInvoice(invoice);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);

    invoice = '';
    result = await service.createInvoice(invoice);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);

    invoice = {
      retailer: 'wefwefwe',
      wholesaler: 'ewewe',
      products: [{
        product: 'dscs',
      }],
    };
    result = await service.createInvoice(invoice);
    expect(result.status).toBe(false);
    expect(Array.isArray(result.result)).toBe(true);
  });

  it('should successfully create an invoice', async () => {
    const q1 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
    let invoice = {
      retailer: '5f76d11c34efef00008298f2',
      wholesaler: '9f00d11c43efef01118298f0',
      listId: v4(),
    };
    let result = await service.createInvoice(invoice);
    expect(result.status).toBe(true);
    expect(typeof result.result).toBe('object');

    const prod = (await pService.createProduct({ name: 'Emzor' })).result._id;
    invoice = {
      retailer: '5f00d33c43efef02987698f9',
      wholesaler: '8f76d00c99efef02118298f2',
      listId: v4(),
      products: [{
        product: prod,
        quantity: 7,
        quantityForm: q1,
      }],
    };
    result = await service.createInvoice(invoice);
    expect(result.status).toBe(true);
    expect(typeof result.result).toBe('object');
  });
});

describe('Update invoice product', () => {
  it('should update invoice product', async () => {
    const q1 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
    const q2 = (await fService.createQuantityForm({ name: 'Box', shortForm: 'Bx' })).result._id;

    const pId = (await pService.createProduct({ name: 'Amalar' })).result._id;
    const p2Id = (await pService.createProduct({ name: 'Orephtal' })).result._id;
    const whId = (await wService.createWholesaler({
      fullName: 'Bernad Ned',
      registrationNumber: '87672',
      phoneNumber: '+2349056778256',
    })).result._id.toString();
    const oldInvoice = {
      retailer: '5f00d22c43efef21800200f2',
      wholesaler: whId,
      listId: v4(),
      products: [{
        product: pId,
        quantity: 4,
        quantityForm: q1,
      }, {
        product: p2Id,
        quantity: 4,
        quantityForm: q2,
      }],
    };
    const invoiceId = (await service.createInvoice(oldInvoice)).result._id;
    (await wpService.createWholesalerProduct({
      wholesaler: whId,
      product: pId,
    }));
    let updateProduct = {
      product: pId,
      costPrice: 200,
      quantity: 3,
      quantityForm: q1,
    };
    let result = await service.updateInvoiceProduct(invoiceId, updateProduct, whId);
    const updatedProduct = result.products.find(e => e.product === pId.toString());
    expect(updatedProduct.costPrice).toBe(200);
    expect(updatedProduct.quantity).toBe(4);

    expect(await wpService.getWholesalerProductCostPrice(
      whId, updateProduct.product, q1,
    )).toBe(200);
    updateProduct = {
      product: 'dedwedwekjfkwefwe',
      costPrice: 100,
    };
    result = await service.updateInvoiceProduct(invoiceId, updateProduct);
    expect(result).toBeNull();
  });
  it('should return null if invoice id is not valid', async () => {
    const updateProduct = {
      product: 'ewjdweifjwe',
      costPrice: 200,
      quantity: 3,
    };
    const result = await service.updateInvoiceProduct('csdcsdwefwede', updateProduct);
    expect(result).toBeNull();
  });
});

describe('update many invoice products', () => {
  it('should update all valid invoice projects', async () => {
    const q1 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
    const q2 = (await fService.createQuantityForm({ name: 'Box', shortForm: 'Bx' })).result._id;

    const p1 = (await pService.createProduct({ name: 'Procold' })).result._id;
    const p2 = (await pService.createProduct({ name: 'Mixanal' })).result._id;
    const whId = (await wService.createWholesaler({
      fullName: 'John Ned',
      registrationNumber: '87672',
      phoneNumber: '+2349056778211',
    })).result._id.toString();
    const oldInvoice = {
      retailer: '0f09d33c43efef00028298f1',
      wholesaler: whId,
      listId: v4(),
      products: [{
        product: p1,
        quantity: 4,
        quantityForm: q1,
      }, {
        product: p2,
        quantity: 4,
        quantityForm: q2,
      }],
    };
    const invoiceId = (await service.createInvoice(oldInvoice)).result._id;
    const updateProducts = [{
      product: p1,
      costPrice: 200,
      quantity: 3,
    },
    {
      product: p2,
      costPrice: 300,
    },
    {
      product: '5f00d22c43efef21811411f4',
      costPrice: 100,
    }];
    let result = await service.updateManyInvoiceProducts(invoiceId, updateProducts);

    const firstProduct = result.products.find(e => e.product._id.toString() === p1.toString());
    expect(firstProduct.costPrice).toBe(200);

    const secondProduct = result.products.find(e => e.product._id.toString() === p2.toString());
    expect(secondProduct.costPrice).toBe(300);

    result = await service.updateManyInvoiceProducts(invoiceId, [{ product: 'sfsdfsd', costPrice: 300 }]);
    const wrongProduct = result.products.find(e => e.product === 'sfsdfsd');
    expect(wrongProduct).not.toBeDefined();
    expect(result.hasWholesalerAddedPrice).toBe(true);
  });
  it('should return null if invoice id is wrong', async () => {
    const updateProducts = [{
      product: 'efwfsdcs',
      costPrice: 300,
    },
    {
      product: 'wfwefewwe',
      costPrice: 322,
    }];
    const result = await service.updateManyInvoiceProducts('5f40d73c43efef02008298f2', updateProducts);
    expect(result).toBeNull();
  });
});

test('Get all retailer invoices', async () => {
  await service.createInvoice({
    retailer: '5f76d33c43efef02008298f2',
    wholesaler: '5f40d73c43efef02008298f2',
    listId: v4(),
  });
  expect((await service.getRetailerInvoices('5f76d33c43efef02008298f2')).length).toBe(1);
});

test('Get all wholesaler invoices', async () => {
  await service.createInvoice({
    retailer: '2f40d73c43efef02008298f2',
    wholesaler: '1f40d73c28efef01008898f1',
    listId: v4(),
  });
  expect((await service.getWholesalerInvoices('1f40d73c28efef01008898f1')).length).toBe(1);
});

test('Get invoice by Id', async () => {
  expect((await service.getInvoiceById('hhqwudyqwdy'))).toBeNull();
});

test('get retailers lists', async () => {
  const lists = await service.getLists('0f09d33c43efef00028298f1');
  expect(lists.length).toBe(1);
  expect(lists[0].products.length).toBe(2);
});

describe('get list product prices', () => {
  it('should return list product prices', async () => {
    const q1 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
    const q2 = (await fService.createQuantityForm({ name: 'Box', shortForm: 'Bx' })).result._id;

    const products = (await pService.createManyProducts([
      { name: 'Artesuname', medicalName: 'Malaria' },
      { name: 'Co-artem', medicalName: 'Malaria' },
    ])).result;
    const wholesalerId = (await wService.createWholesaler({
      fullName: 'Bernad Bakens',
      registrationNumber: '87672',
      phoneNumber: '+2349078778256',
    })).result._id;
    await wpService.createWholesalerProduct({
      wholesaler: wholesalerId,
      product: products[0]._id,
      formPrices: [
        { form: q1, price: 4000 },
      ],
    });
    await wpService.createWholesalerProduct({
      wholesaler: wholesalerId,
      product: products[1]._id,
      formPrices: [
        { form: q2, price: 5600 },
      ],
    });
    const listId = v4();
    await service.createInvoice({
      retailer: '2f40d73c11efef02008298f2',
      wholesaler: wholesalerId,
      listId,
      products: [{
        product: products[0]._id,
        quantity: 3,
        quantityForm: q1,
      }, {
        product: products[1]._id,
        quantity: 2,
        quantityForm: q2,
      }],
    });

    await service.createInvoice({
      retailer: '2f40d73c11efef02008298f2',
      wholesaler: '0f40d73c11efef02118000f2',
      listId,
      products: [{
        product: products[0]._id,
        quantity: 3,
        quantityForm: q1,
      }, {
        product: products[1]._id,
        quantity: 2,
        quantityForm: q2,
      }],
    });
    const listPrices = await service.getListProductPrices(listId, products[0]._id);
    expect(Array.isArray(listPrices)).toBe(true);
    expect(listPrices.length).toBe(2);
  });
});

test('should return list product prices', async () => {
  const q1 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
  const q2 = (await fService.createQuantityForm({ name: 'Box', shortForm: 'Bx' })).result._id;

  const products = (await pService.createManyProducts([
    { name: 'P-Alaxin', medicalName: 'Malaria' },
    { name: 'Calcimax', medicalName: 'Malaria' },
  ])).result;
  const wholesalerId = (await wService.createWholesaler({
    fullName: 'Bernad Bakens',
    registrationNumber: '87672',
    phoneNumber: '+2349078778256',
  })).result._id;
  await wpService.createWholesalerProduct({
    wholesaler: wholesalerId,
    product: products[0]._id,
    formPrices: [
      { form: q1, price: 3500 },
    ],
  });
  await wpService.createWholesalerProduct({
    wholesaler: wholesalerId,
    product: products[1]._id,
    formPrices: [
      { form: q1, price: 5600 },
    ],
  });
  const listId = v4();
  await service.createInvoice({
    retailer: '2f40d73c11efef02008298f2',
    wholesaler: wholesalerId,
    listId,
    products: [{
      product: products[0]._id,
      quantity: 3,
      quantityForm: q1,
    }, {
      product: products[1]._id,
      quantity: 2,
      quantityForm: q2,
    }],
  });
  await service.createInvoice({
    retailer: '2f40d73c11efef02008298f2',
    wholesaler: '0f40d73c11efef02118000f2',
    listId,
    products: [{
      product: products[0]._id,
      quantity: 3,
      quantityForm: q1,
    }, {
      product: products[1]._id,
      quantity: 2,
      quantityForm: q2,
    }],
  });
  const listPrices = await service.getListProductsPrices(listId);
  expect(Array.isArray(listPrices)).toBe(true);
  expect(listPrices.length).toBe(2);
});

test('close list', async () => {
  const q1 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
  const q2 = (await fService.createQuantityForm({ name: 'Box', shortForm: 'Bx' })).result._id;

  const products = (await pService.createManyProducts([
    { name: 'P-Alaxin', medicalName: 'Malaria' },
    { name: 'Calcimax', medicalName: 'Malaria' },
  ])).result;

  const listId = v4();
  const retailerId = '2f40d73c11efef02008298f2';
  await service.createInvoice({
    retailer: retailerId,
    wholesaler: '0f40d73c11efef02118000f2',
    listId,
    products: [{
      product: products[0]._id,
      quantity: 3,
      quantityForm: q1,
    }, {
      product: products[1]._id,
      quantity: 2,
      quantityForm: q2,
    }],
  });
  const resultStatus = await service.closeList(listId, retailerId);
  expect(resultStatus.nModified).toBe(1);
});

describe('get list', () => {
  it('should return null if retailer list does not exoist', async () => {
    const list = await service.getList('zf00t11c00esty032476743r2', 'hdqwedqwjhdwjhkqdqwyhgyduqw');
    expect(list).toBeNull();
  });

  it('should return list products', async () => {
    const q1 = (await fService.createQuantityForm({ name: 'Packet', shortForm: 'Pkt' })).result._id;
    const q2 = (await fService.createQuantityForm({ name: 'Box', shortForm: 'Bx' })).result._id;

    const products = (await pService.createManyProducts([
      { name: 'P-Alaxin', medicalName: 'Malaria' },
      { name: 'Calcimax', medicalName: 'Malaria' },
    ])).result;

    const listId = v4();
    const retailerId = 'zf21t22c00ezz032476743r2';
    await service.createInvoice({
      retailer: retailerId,
      wholesaler: 'zf21t22c00efef02118000f2',
      listId,
      products: [{
        product: products[0]._id,
        quantity: 3,
        quantityForm: q1,
      }, {
        product: products[1]._id,
        quantity: 2,
        quantityForm: q2,
      }],
    });
    const list = await service.getList(retailerId, listId);
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(2);
  });
});

afterAll(async done => {
  closeConn();
  done();
});