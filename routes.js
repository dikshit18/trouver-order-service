const routes = require('express').Router();
const {startTransition} = require('./services/startTransition');
const {fetchAllOrders} = require('./services/fetchAllOrders');
const {fetchOrder} = require('./services/fetchOrder');
const {orderHistory} = require('./services/orderHistory');
routes.put('/shared/order/start', startTransition);
routes.get('/shared/order/details/:orderId', fetchOrder);
routes.get('/shared/order/details', fetchAllOrders);
routes.put('/shared/order/history', orderHistory);
module.exports = routes;
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
