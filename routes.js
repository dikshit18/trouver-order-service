const routes = require('express').Router();
// const {disAssociateorderSet} = require('./services/disassociateorder');
// const {fetchAllorders} = require('./services/fetchAllorders');
// const {associateorderSet} = require('./services/associateorder');
// const {getorderDocument} = require('./services/orderDoc');
routes.put('/shared/order/start', getorderDocument);
routes.put('/shared/order/stop', getorderDocument);
routes.get('/shared/order/details/:orderId', fetchAllorders);
routes.get('/shared/order/all', associateorderSet);
routes.get('/shared/order/warehouses', associateorderSet);
routes.get('/shared/order/history', associateorderSet);
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
    timestamp:"UTC"
    }]
    }



*/
