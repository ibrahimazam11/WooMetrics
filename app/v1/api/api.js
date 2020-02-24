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

apiRoutes.get('/test', WooCommerceController.test)

module.exports = apiRoutes
