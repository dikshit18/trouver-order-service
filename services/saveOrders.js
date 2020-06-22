require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {validateSchema} = require('../utils/validator');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const {v4: uuid} = require('uuid');
const moment = require('moment');
const saveOrders = async event => {
  try {
    if (event.Records.length) {
      for (const record of event.Records) {
        const order = event;
        await validateSchema(order, schema.saveOrderSchema);
        order['orderId'] = uuid();
        order['transition'] = 'off';
        order['currentLocation'] = 'Warehouse';
        order['history'] = [];
      }
      await saveOrdersToDb(order);
    }
  } catch (e) {
    console.log('Error...', e);
    //Needed to be defined again
    //Handle invalid order
  }
};
const saveOrdersToDb = async order => {
  const params = {
    TableName: process.env.ORDER_DETAILS_TABLE,
    Item: {
      ...order
    }
  };
  await dynamoDb.create(params);
};
module.exports = {saveOrders};
