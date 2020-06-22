require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {schema} = require('../utils/schema');
const {validateSchema} = require('../utils/validator');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {getAllWarehouse} = require('../utils/warehouse');
const fetchOrder = async (req, res) => {
  try {
    await validateSchema(req.params, schema.fetchOrderDetails);
    const {orderId} = req.params;
    const params = {
      TableName: process.env.ORDER_DETAILS_TABLE,
      KeyConditionExpression: 'orderId = :orderId',

      ExpressionAttributeValues: {
        ':orderId': orderId
      }
    };
    const orders = await dynamoDb.query(params);
    if (orders.Items.length) {
      const {currentLocation, orderDetails} = orders.Items[0];
      const {address} = orderDetails;
      const {district} = address;
      const warehouses = await getAllWarehouse();
      const destinationIndex = warehouses.indexOf(district);
      const finalWarehouses = warehouses.slice(0, destinationIndex + 1);
      const copiedArray = [...finalWarehouses];
      const remainingWarehousesIndex = copiedArray.indexOf(currentLocation);
      const remainingWarehouses = copiedArray.splice(remainingWarehousesIndex + 1);
      orders.Items[0].warehouse = finalWarehouses;
      orders.Items[0].warehouseDropdown = remainingWarehouses;
      const response = successCodes['fetchOrdersSuccess'];
      return res.status(response.statusCode).send({
        statusCode: response.statusCode,
        code: response.code,
        orderDetails: {...orders.Items[0]}
      });
    } else {
      return res.status(200).send({
        statusCode: 200,
        orderDetails: {}
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
