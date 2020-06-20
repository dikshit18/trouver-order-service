require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {validateSchema} = require('../utils/validator');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const moment = require('moment');
const saveOrders = async event => {
  try {
    if (event.Records.length) {
      for (const record of event.Records) {
        const order = JSON.parse(record.body);
        await schema.saveOrderSchema(order);
        order['id'] = uuid();
        order['transition'] = 'off';
        order['currentLocation'] = 'Warehouse';
      }
      await saveOrdersToDb(order)
    }
  } catch (e) {
    //Needed to be defined again
    //Handle invalid order
  }
};
const saveOrdersToDb = order => {
  const params = {
    TableName: process.env.ORDER_DETAILS_TABLE,
    Item: {
    ...order
    }
  };
  await dynamoDb.create(params);
};
module.exports = {saveOrders};
