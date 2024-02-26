const express = require('express');
const { registerAdminUserController, loginAdminUserController, detailAdminUserController } = require('./controllers/admin/user.controller');
const { authAdminLoginMiddleware } = require('./middlewares/authUser.middleware');
const routes = express();

routes.post('/admin/usuario', registerAdminUserController);
routes.post('/admin/login', loginAdminUserController);

routes.use(authAdminLoginMiddleware);

routes.get('/admin/usuario', detailAdminUserController);

module.exports = routes;