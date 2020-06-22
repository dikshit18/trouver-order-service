const permissionEndpoint = 'http://localhost:3001/shared/permission/permission-document-all';
const axios = require('axios');

const allowedURLs = [
  '/shared/order/start',
  '/shared/order/details/:orderId',
  '/shared/order/details',
  '/shared/order/history'
];

const allowedPermissionMap = {
  '/shared/order/start': 'shared.orders.sysAdmin',
  '/shared/order/details/:orderId': 'shared.orders.read',
  '/shared/order/details': 'shared.orders.read',
  '/shared/order/history': 'shared.orders.write'
};

const checkPermissions = async (req, res, next) => {
  if (allowedURLs.includes(req._parsedUrl.pathname)) {
    // const config = {
    //   headers: {
    //     Authorization: idToken,
    //     'x-ehg-custom-authorization': customToken
    //   }
    // };
    try {
      let permissionsAssociated = await axios.get(`${permissionEndpoint}`, config);
      if (permissionsAssociated.data && permissionsAssociated.data.permissionSets.length) {
        const permissionNeeded = allowedPermissionMap[req._parsedUrl.pathname];
        const isAllowed = permissionsAssociated.data.permissionSets.find(
          item => item.permissionSetCode == permissionNeeded
        );
        if (isAllowed) return next();
        return res.status(403).send({
          message: 'Forbidden'
        });
      }
    } catch (e) {
      return res.status(403).send({message: 'Forbidden'});
    }
  } else next();
};

module.exports = {checkPermissions};
