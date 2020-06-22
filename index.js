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

// const event = {
//   productId: 'faa3a4a0-a7ae-4531-90d6-efcf34c92dbc',
//   productDetails: [
//     {
//       name: 'Mask',
//       label: 'Mask',
//       quantity: 2
//     }
//   ],
//   orderDetails: {
//     recipientName: 'Dikshit',
//     address: {
//       line1: 'H.No 552',
//       line2: 'Sector 5',
//       line3: 'Kurukshetra',
//       district: 'Kurukshetra'
//     },
//     phoneNumber: '21832983298438'
//   }
// };

// exports
//   .handler(event)
//   //.then(data => console.log(data))
//   .catch(error => console.log('Error is...', error));
