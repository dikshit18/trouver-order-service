require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
exports.getAllWarehouse = async () => {
  const params = {TableName: process.env.WAREHOUSE_DETAILS_TABLE};
  return await dynamoDb.scan(params);
};
