require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {schema} = require('../utils/schema');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {validateSchema} = require('../utils/validator');
const moment = require('moment');
const {getAllWarehouse} = require('../utils/warehouse');
const {v4: uuid} = require('uuid');
const orderHistory = async (req, res) => {
  try {
    await validateSchema(req.body, schema.saveOrderHistorySchema);
    const {orderId, description, currentLocation} = req.body;
    const params = {
      TableName: process.env.ORDER_DETAILS_TABLE,
      Key: {
        orderId
      }
    };
    const orderDetails = await dynamoDb.get(params);
    if (orderDetails) {
      let {history} = orderDetails.Item;
      if (!history) history = [];
      history.push({
        id: uuid(),
        description,
        timestamp: moment.utc().format()
      });
      await updateOrder(orderId, history, currentLocation);
    }
    const response = successCodes['orderHistorySuccess'];
    return res.status(response.statusCode).send({
      statusCode: response.statusCode,
      code: response.code
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
const updateOrder = async (orderId, history, currentLocation) => {
  const params = {
    TableName: process.env.ORDER_DETAILS_TABLE,
    Key: {orderId},
    UpdateExpression: 'set history = :history , currentLocation= :currentLocation',
    ConditionExpression: 'attribute_exists(orderId)',
    ExpressionAttributeValues: {
      ':history': history,
      ':currentLocation': currentLocation
    }
  };
  return await dynamoDb.update(params);
};
module.exports = {orderHistory};
