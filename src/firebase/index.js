/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = firebaseAdmin.firestore();

const createMarketRequest = async ({ retailer, wholesaler, products }) => {
  try {
    const result = await db.collection('market_requests').add({
      retailerId: retailer && retailer._id ? retailer._id.toString() : '',
      retailer: retailer && retailer.fullName ? retailer.fullName : '',
      wholesalerId: wholesaler && wholesaler._id ? wholesaler._id.toString() : '',
      wholesaler: wholesaler && wholesaler.fullName ? wholesaler.fullName : '',
      products: products.map(p => ({
        form: p.quantityForm.name, name: p.product.name, quantity: p.quantity, unitPrice: 0,
      })),
      processing_state: 'pending',
      agent: '',
      price_added: false,
    });
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = {
  createMarketRequest,
  firebaseAdmin,
};
