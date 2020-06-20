require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
const {validateSchema} = require('../utils/validator');
const {errorCodes, successCodes} = require('../utils/responseCodes');
const {schema} = require('../utils/schema');
const moment = require('moment');
const startTransition = async (req, res) => {
  try {
    await validateSchema(req.body, schema.startTransitionSchema);
    const {orderId} = req.body;
    const params = {
      TableName: process.env.ORDER_DETAILS_TABLE,
      Key: {orderId},
      UpdateExpression: 'set #transition = :transition',
      ExpressionAttributeNames: {'#transition': 'transition'},
      ExpressionAttributeValues: {
        ':transition': 'on'
      }
    };
    await dynamoDb.update(params);
    const response = successCodes['orderTransitionSuccess'];
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

module.exports = {startTransition};
