const app = require('./app');
const awsServerlessExpress = require('aws-serverless-express');
const {saveOrders} = require('./services/saveOrders');
const server = awsServerlessExpress.createServer(app);

exports.handler = async (event, context) => {
  if (event.Records) {
    await saveOrders(event);
  } else {
    return awsServerlessExpress.proxy(server, event, context);
  }
};
