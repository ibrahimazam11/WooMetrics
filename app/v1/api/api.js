const express = require('express')
const apiRoutes = express.Router()

const UserController = require('../controllers/users');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const WooCommerceController = require('../../config/wooCommerce');

apiRoutes.get('/user/auth', auth, UserController.auth);
apiRoutes.post('/user/register', UserController.register);
apiRoutes.post('/user/login', UserController.login);
apiRoutes.get('/user/logout', auth, UserController.logout);

apiRoutes.get('/test', WooCommerceController.test1)
apiRoutes.get('/return-page', WooCommerceController.returnPage)
apiRoutes.post('/callback-endpoint', WooCommerceController.callbackEndpoint)


module.exports = apiRoutes
