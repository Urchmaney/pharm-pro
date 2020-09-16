/* eslint-disable no-underscore-dangle */
const mongoConnect = require('../src/data_access/connect');

let service = null;
let closeConn = null;
let dbase = null;

beforeAll(async () => {
  const { productService, closeConnect, db } = await mongoConnect(global.__MONGO_URI__);
  service = productService;
  closeConn = closeConnect;
  dbase = db;
});

beforeEach(async () => {
  await dbase.collection('products').deleteMany({});
});

describe('Add create product', () => {
  it('should not create if name is missing', async () => {
    const product = {};
    const { status, result } = await service.createProduct(product);
    expect(status).toBe(false);
    expect(result.length).toBe(1);
  });
  it('should create product if name is present', async () => {
    const product = { name: 'Phenobab', companyName: 'Emzor', form: 'Syrup' };
    const { status, result } = await service.createProduct(product);
    expect(status).toBe(true);
    expect(result._id).toBeDefined();
    expect(result).toBeDefined();
  });
});

describe('All products', () => {
  it('should return all products', async () => {
    await service.createManyProducts([
      { name: 'Analgin', medicalName: 'ome' },
      { name: 'Ibuprofen', medicalName: 'Analgesic' },
      { name: 'Abuprofen', medicalName: 'Analgesic' },
      { name: 'Profen', medicalName: 'Analgesic' },
    ]);
    const products = await service.getProducts();
    expect(products.length).toBe(4);
  });
  it('should return based on the search string index', async () => {
    await service.createManyProducts([
      { name: 'Analgin', medicalName: 'ome' },
      { name: 'Ibuprofen', medicalName: 'Analgesic' },
      { name: 'Abuleprofen', medicalName: 'Analgesic' },
      { name: 'Profen', medicalName: 'Analgesic' },
    ]);
    const products = await service.getProducts('pro');
    expect(products.length).toBe(3);
    expect(products[0].name).toBe('Profen');
  });
});

describe('Product ', () => {
  it('should return product if id exists', async () => {
    const { result } = await service.createProduct({ name: 'lonely' });
    const product = await service.getProduct(result._id);
    expect(product).toBeDefined();
  });
  it('should return null if id does not exist', async () => {
    let id = '43jjdjdidscc';
    let product = await service.getProduct(id);
    expect(product).toBeNull();
    id = '';
    product = await service.getProduct(id);
    expect(product).toBeNull();
    id = {};
    product = await service.getProduct(id);
    expect(product).toBeNull();
  });
});

describe('Update Product', () => {
  it('should return update object if new Object is valid', async () => {
    const productObj = (await service.createProduct({ name: 'amoxil' })).result;
    const updateObj = { name: 'Amoxil' };
    const result = await service.updateProduct(productObj._id, updateObj);
    const gProductObj = await service.getProduct(productObj._id);

    expect(result).toBeDefined();
    expect(result.name).toBe('Amoxil');
    expect(gProductObj).toBeDefined();
    expect(gProductObj.name).toBe('Amoxil');
  });
  it('should not update object if new object is not valid', async () => {
    const productObj = (await service.createProduct({ name: 'paracetamol' })).result;
    const updateObj = { field: 'paaa' };
    const result = await service.updateProduct(productObj._id, updateObj);
    expect(result).toBeDefined();
    expect(result.field).not.toBeDefined();
  });
  it('should return null if id not found', async () => {
    let id = '39uejkeercdfer';
    const updateObj = { name: 'Amoxil' };
    let result = await service.updateProduct(id, updateObj);
    expect(result).toBeNull();

    id = '5f1b444840622921692f789de';
    result = await service.updateProduct(id, updateObj);
    expect(result).toBeNull();
  });
});

describe('Insert Many products', () => {
  it('should fail if one is invalid', async () => {
    const products = [
      {
        name: 'kjfdfd',
        companyName: 'kfdfe',
      },
      {
        name: 'vfsdfcvsdf',
      },
      {
        companyName: 'fsmds',
      }];
    const { status, result } = await service.createManyProducts(products);
    const ps = await service.getProducts();
    expect(ps.length).toBe(0);
    expect(status).toBe(false);
    expect(typeof result).toBe('string');
  });
  it('should add many product if they valid', async () => {
    const products = [{
      name: 'Nenef',
      companyName: 'fsmds',
    },
    {
      name: 'kjfdfd',
      companyName: 'kfdfe',
    }];
    const { status, result } = await service.createManyProducts(products);
    expect(status).toBe(true);
    expect((await service.getProducts()).length).toBe(2);
    expect(Array.isArray(result)).toBe(true);
  });
  it('should fail if the products is not an array', async () => {
    let result = await service.createManyProducts('');
    expect(result.status).toBe(false);
    expect(typeof result.result).toBe('string');

    result = await service.createManyProducts({});
    expect(result.status).toBe(false);
    expect(typeof result.result).toBe('string');

    result = await service.createManyProducts(undefined);
    expect(result.status).toBe(false);
    expect(typeof result.result).toBe('string');
  });
});

afterAll(done => {
  closeConn();
  done();
});