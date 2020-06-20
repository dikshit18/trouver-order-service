require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {schema} = require('../utils/schema');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {getAllWarehouse} = require('../utils/warehouse');
const fetchOrder = async (req, res) => {
  try {
    await schema.fetchOrderDetails(req.params);
    const {orderId} = req.params;
    const params = {
      TableName: process.env.ORDER_DETAILS_TABLE,
      KeyConditionExpression: 'orderId = :orderId',
      // ExpressionAttributeNames: {
      //   '#subIdentity': 'sub'
      // },
      ExpressionAttributeValues: {
        ':orderId': orderId
      }
    };
    const orders = await dynamoDb.query(params);
    if (orders.Items.length) {
      const {currentLocation} = orders.Items[0].currentLocation;
      const warehouses = await getAllWarehouse().Items;
      const remainingWarehousesIndex = warehouses.indexOf(currentLocation);
      const remainingWarehouses = warehouses.splice(remainingWarehousesIndex + 1);
      const response = successCodes['fetchOrdersSuccess'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code,
        orders: orders.Items,
        warehouse: remainingWarehouses
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
module.exports = {fetchOrder};
