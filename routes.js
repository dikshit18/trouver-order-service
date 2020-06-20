const routes = require('express').Router();
const {startTransition} = require('./services/startTransition');
const {fetchAllOrders} = require('./services/fetchAllOrders');
const {fetchOrder} = require('./services/fetchOrder');
// const {associateorderSet} = require('./services/associateorder');
// const {getorderDocument} = require('./services/orderDoc');
routes.put('/shared/order/start', startTransition);
routes.get('/shared/order/details/:orderId', fetchOrder);
routes.get('/shared/order/details', fetchOrders);
// routes.get('/shared/order/warehouses', associateorderSet);
routes.put('/shared/order/history', associateorderSet);
module.exports = routes;
//1. POST Start Transition
//2. GET ,orderDetails/orderID, will include warehouse details
// orderDetails will have a column which will tell the current location of the order
//3. GET order-history
//4. GET warehoures
//5.

/*
    {
    "orderId":"123141313211-31232183213213",
    "tranisition":"on",
    "currentLocation":"kurukshetra",
    "history":[{
    "id":"1212-312321-31-23213-213",
    description:"Rahul has started the transition.",
    timestamp:"UTC"
    },{
    "id":"1212-312321-31-23213-213",
    description:"John has updated the destination at Karnal",
    timestamp:"UTC",
    }],
    productId:"72383-238733-282-297-2",
    productDetails:[{
    "name":"Mask",
    "label":"Mask",
    "quantity":2
    }],
    "orderDetails":{
    "recipientName":"Dikshit",
    "address":{
    line1:"H.No 552",
    "line2":"Sector 5",
    "line3":"Kurukshetra",
    "district":"Kurukshetra"
    }
    "phoneNumber":"21832983298438"
    }
    }



*/
