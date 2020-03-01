const express = require('express')
const apiRoutes = express.Router()

const UserController = require('../controllers/users');
const OrderController = require('../controllers/orders');
const CustomerController = require('../controllers/customers');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { wcPermission } = require('../middleware/wcPermission');
const WooCommerceController = require('../../config/wooCommerce');


/****
    User endpoints
****/
apiRoutes.get('/user/auth', auth, UserController.auth);
apiRoutes.post('/user/register', UserController.register);
apiRoutes.post('/user/login', UserController.login);
apiRoutes.get('/user/logout', auth, UserController.logout);

/****
    WooCommerce endpoints
****/
apiRoutes.post('/wc/requestPermission', auth, WooCommerceController.permission)
apiRoutes.post('/wc/callback-endpoint', WooCommerceController.callbackEndpoint)

/**** Orders ****/
apiRoutes.get('/wc/order/all', auth, wcPermission, OrderController.getAll)
apiRoutes.get('/wc/order/:orderId/refunds', auth, wcPermission, OrderController.refunds)
apiRoutes.get('/wc/order/:orderId/notes', auth, wcPermission, OrderController.notes)
apiRoutes.post('/wc/order/:orderId/note', auth, wcPermission, OrderController.addNote)

/**** Customers ****/
apiRoutes.get('/wc/customer/all', auth, wcPermission, CustomerController.getAll)

module.exports = apiRoutes
