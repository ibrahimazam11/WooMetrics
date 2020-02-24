const express = require('express')
const apiRoutes = express.Router()

const UserController = require('../controllers/users');
const { auth } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

apiRoutes.get('/user/auth', auth, UserController.auth);
apiRoutes.post('/user/register', UserController.register);
apiRoutes.post('/user/login', UserController.login);
apiRoutes.get('/user/logout', auth, UserController.logout);

module.exports = apiRoutes
