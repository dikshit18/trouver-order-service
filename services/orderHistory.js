require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {schema} = require('../utils/schema');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {getAllWarehouse} = require('../utils/warehouse');
const {v4: uuid} = require('uuid');
const fetchOrder = async (req, res) => {
  try {
    await schema.fetchOrderDetails(req.body);
    const {orderId, description} = req.body;
    const params = {
      TableName: process.env.ADMIN_TABLE,
      Key: {
        orderId
      }
    };
    const orderDetails = await dynamoDb.get(params);
    if (orderDetails) {
      let {history} = orderDetails;
      if (!history) history = [];
      history.push({
        id: uuid(),
        description
      });
      await updateOrder(orderId, history);
    }
    const response = successCodes['orderHistorySuccess'];
    return res.status(response.statusCode).send({
      statusCode: response.statusCode,
      code: response.code,
      orders: orders.Items,
      warehouse: remainingWarehouses
    });
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
const updateOrder = async (orderId, history) => {
  const params = {
    TableName: process.env.ORDER_DETAILS_TABLE,
    Key: {orderId},
    UpdateExpression: 'set history = :history',
    ExpressionAttributeValues: {
      ':history': history
    }
  };
  return await dynamoDb.update(params);
};
module.exports = {fetchOrder};
