require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const fetchAllOrders = async (_, res) => {
  try {
    const params = {
      TableName: process.env.ORDER_DETAILS_TABLE
    };
    const orders = await dynamoDb.scan(params);
    if (orders.Items.length) {
      const response = successCodes['fetchOrdersSuccess'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code,
        orders: orders.Items
      });
    } else {
      return res.status(200).send({
        statusCode: 200,
        orders: []
      });
    }
  } catch (e) {
    //Needed to be defined again
    if (e.code === 'schemaError') {
      const response = errorCodes['joi'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    } else {
      //default error
      const response = errorCodes['default'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code
      });
    }
  }
};
module.exports = {fetchAllOrders};
