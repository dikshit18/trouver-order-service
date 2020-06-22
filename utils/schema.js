const Joi = require('@hapi/joi');
const JoiGuidV4 = Joi.string().guid({version: ['uuidv4']});

const productDetails = Joi.object().keys({
  name: Joi.string().required(),
  label: Joi.string().required(),
  quantity: Joi.number().required()
});

const schema = (() => {
  return {
    saveOrderSchema: Joi.object()
      .keys({
        productId: JoiGuidV4.required(),
        productDetails: Joi.array()
          .items(productDetails)
          .required(),
        orderDetails: Joi.object().keys({
          recipientName: Joi.string().required(),
          address: Joi.object().keys({
            line1: Joi.string().required(),
            line2: Joi.string().required(),
            line3: Joi.string().required(),
            district: Joi.string().required()
          }),
          phoneNumber: Joi.string().required()
        })
      })
      .unknown(false),
    fetchOrderDetails: Joi.object()
      .keys({orderId: JoiGuidV4.required()})
      .unknown(false),
    startTransitionSchema: Joi.object()
      .keys({
        orderId: JoiGuidV4.required()
      })
      .unknown(false),
    saveOrderHistorySchema: Joi.object()
      .keys({
        orderId: JoiGuidV4.required(),
        description: Joi.string().required(),
        currentLocation: Joi.string().required()
      })
      .unknown(false)
  };
})();

module.exports = {schema};
