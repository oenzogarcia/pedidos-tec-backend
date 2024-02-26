const knex = require('../../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateNameUtils, validateEmailUtils, validatePasswordUtils, validateFieldsUtils } = require('../../utils/validateLoginInfo.utils');


const registerAdminUserController = async (req, res) => {
    const {nome, email, senha} = req.body;

    const errorMessage = await validateFieldsUtils({nome, email, senha}, {nome: 'Nome', email: 'E-mail', senha: 'Senha'})

    if (errorMessage) {
        return res.status(400).json({message: errorMessage});
    }

    const nameIsValid = await validateNameUtils(nome);
    const emailIsValid = await validateEmailUtils(email);
    const passwordIsValid = await validatePasswordUtils(senha);

    if (!nameIsValid) {
        return res.status(400).json({message: 'Nome em formato inválido!'});
    }

    if (!emailIsValid) {
        return res.status(400).json({message: 'E-mail em formato inválido!'});
    }

    if (!passwordIsValid) {
        return res.status(400).json({message: 'Senha inválida! A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.'});
    }

    

    try {
        const emailExist = await knex('usuario_admin').where({email}).first();

        if (emailExist) {
            return res.status(400).json({message: 'Este e-mail já está cadastrado'});
        }
        
        const encryptedPassword = await bcrypt.hash(senha, 10);

        const user = await knex('usuario_admin').insert({nome, email, senha: encryptedPassword}).returning(['nome', 'email']);

        return res.status(201).json({message: 'Conta criada com sucesso!', user});

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Erro interno de servidor'});
    }
}

const loginAdminUserController = async (req, res) => {
    const {email, senha} = req.body;
    
    const errorMessage = await validateFieldsUtils({email, senha}, {email: 'E-mail', senha: 'Senha'})

    if (errorMessage) {
        return res.status(400).json({message: errorMessage});
    }

    try {
        const user = await knex('usuario_admin').where({email}).first();

        if (!user) {
            return res.status(401).json({message: 'Usuário/senha incorreta!'});
        }

        const passwordIsValid = await bcrypt.compare(senha, user.senha);

        if(!passwordIsValid) {
            return res.status(401).json({message: 'Usuário/senha incorreta!'});
        }
        
        const token = jwt.sign({id: user.id}, process.env.JWT_KEY, {expiresIn: '10h'});

        const {senha: _, ...loggedUser} = user;

        return res.status(200).json({loggedUser, token});
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Erro interno de servidor'}); 
    }
}

const detailAdminUserController = async (req, res) => {
    try {
        const {senha: _, ...userDetails} = req.user;
        return res.status(200).json(userDetails);
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Erro interno de servidor'}); 
    }
}


module.exports = {
    registerAdminUserController,
    loginAdminUserController,
    detailAdminUserController
}