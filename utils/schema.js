const Joi = require('@hapi/joi');
const JoiGuidV4 = Joi.string().guid({version: ['uuidv4']});

const productDetails = Joi.object().keys({
  name: Joi.string().required(),
  label: Joi.string().required(),
  qauntity: Joi.number().required()
});

const schema = (() => {
  return {
    saveOrderSchema: Joi.object()
      .keys({
        productId: JoiGuidV4.required(),
        permissionSets: Joi.array().required(),
        productDetails: Joi.array(productDetails).required(),
        orderDetails: Joi.object().keys({
          recipientName: Joi.string().required(),
          address: Joi.string().required(),
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
        description: Joi.string().required()
      })
      .unknown(false)
  };
})();

module.exports = {schema};
