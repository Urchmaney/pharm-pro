/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');


let service = null;
let closeConn = null;
const products = [];

beforeAll(async () => {
  const {
    invoiceService,
    closeConnect,
  } = await mongoConnect(global.__MONGO_URI__);
  service = invoiceService;
  closeConn = closeConnect;
  await Promise.all(products);
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
    let invoice = {
      retailer: '5f76d11c34efef00008298f2',
      wholesaler: '9f00d11c43efef01118298f0',
    };
    let result = await service.createInvoice(invoice);
    expect(result.status).toBe(true);
    expect(typeof result.result).toBe('object');

    invoice = {
      retailer: '5f00d33c43efef02987698f9',
      wholesaler: '8f76d00c99efef02118298f2',
      products: [{
        product: 'dscs',
        quantity: 7,
        quantityType: 'Packet',
      }],
    };
    result = await service.createInvoice(invoice);
    expect(result.status).toBe(true);
    expect(typeof result.result).toBe('object');
  });
});

describe('Update invoice product', () => {
  it('should update invoice product', async () => {
    const oldInvoice = {
      retailer: '5f00d22c43efef21800200f2',
      wholesaler: '5f99d00c43efef02111198f2',
      products: [{
        product: 'ewjdweifjwe',
        quantity: 4,
        quantityType: 'Satchet',
      }, {
        product: 'ewjdweiedwedwewe',
        quantity: 4,
        quantityType: 'Satchet',
      }],
    };
    const invoiceId = (await service.createInvoice(oldInvoice)).result._id;
    let updateProduct = {
      product: 'ewjdweifjwe',
      costPrice: 200,
      quantity: 3,
    };
    let result = await service.updateInvoiceProduct(invoiceId, updateProduct);
    const updatedProduct = result.products.find(e => e.product === 'ewjdweifjwe');
    expect(updatedProduct.costPrice).toBe(200);
    expect(updatedProduct.quantity).toBe(4);

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
    const oldInvoice = {
      retailer: '0f09d33c43efef00028298f1',
      wholesaler: '4f76y33b43efef02008000f8',
      products: [{
        product: 'ewjdweifjwe',
        quantity: 4,
        quantityType: 'Satchet',
      }, {
        product: 'ewjdweiedwedwewe',
        quantity: 4,
        quantityType: 'Satchet',
      }],
    };
    const invoiceId = (await service.createInvoice(oldInvoice)).result._id;
    const updateProducts = [{
      product: 'ewjdweifjwe',
      costPrice: 200,
      quantity: 3,
    },
    {
      product: 'ewjdweiedwedwewe',
      costPrice: 300,
    },
    {
      product: 'wdwqdwqdweqdqwed',
      costPrice: 100,
    }];
    let result = await service.updateManyInvoiceProducts(invoiceId, updateProducts);
    const firstProduct = result.products.find(e => e.product === 'ewjdweifjwe');
    expect(firstProduct.costPrice).toBe(200);

    const secondProduct = result.products.find(e => e.product === 'ewjdweiedwedwewe');
    expect(secondProduct.costPrice).toBe(300);

    result = await service.updateManyInvoiceProducts(invoiceId, [{ product: 'sfsdfsd', costPrice: 300 }]);
    expect(result).toBeNull();
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
  });
  expect((await service.getRetailerInvoices('5f76d33c43efef02008298f2')).length).toBe(1);
});

test('Get all wholesaler invoices', async () => {
  await service.createInvoice({
    retailer: '2f40d73c43efef02008298f2',
    wholesaler: '1f40d73c28efef01008898f1',
  });
  expect((await service.getWholesalerInvoices('1f40d73c28efef01008898f1')).length).toBe(1);
});

test('Get invoice by Id', async () => {
  expect((await service.getInvoiceById('hhqwudyqwdy'))).toBeNull();
});

afterAll(async done => {
  closeConn();
  done();
});