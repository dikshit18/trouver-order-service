require('dotenv').config();
const {dynamoDb} = require('../dbConfig/dynamoDb');
exports.getAllWarehouse = async () => {
  const params = {TableName: process.env.WAREHOUSE_DETAILS_TABLE};
  const data = await dynamoDb.scan(params);
  const warehouse = data.Items[0].warehouses;
  return warehouse;
};
