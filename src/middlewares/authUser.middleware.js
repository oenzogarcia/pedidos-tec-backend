const knex = require('../connection');
const jwt = require('jsonwebtoken');


const authAdminLoginMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Você precisa estar logado.' });
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, process.env.JWT_KEY);

        const userLogged = await knex('usuario_admin').where({ id }).first();

        if (!userLogged) {
            return res.status(401).json({ message: 'Você precisa estar logado.' })
        }

        req.user = userLogged;

        next();

    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ message: 'Sua sessão já expirou. Favor logar novamente.' });
    }
}

module.exports = {
    authAdminLoginMiddleware
}