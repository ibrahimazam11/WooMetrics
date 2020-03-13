const express = require('express')
const apiRoutes = express.Router()
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const { wcPermission } = require('../middleware/wcPermission');
const WooCommerceController = require('../../config/wooCommerce');
const ProductController = require('../controllers/products');
const UserController = require('../controllers/users');
const OrderController = require('../controllers/orders');
const CustomerController = require('../controllers/customers');


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
apiRoutes.get('/wc/order/segment', auth, wcPermission, OrderController.segments)
apiRoutes.get('/wc/order/customer', auth, wcPermission, OrderController.getCustomerOrders)

/**** Customers ****/
apiRoutes.get('/wc/customer/all', auth, wcPermission, CustomerController.getAll)

/**** Products ****/
apiRoutes.get('/wc/product/all', auth, wcPermission, ProductController.getAll)
apiRoutes.get('/wc/product/variations', auth, wcPermission, ProductController.getAllVariations)

module.exports = apiRoutes
