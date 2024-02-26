const validateNameUtils = async (nome) => {
    const regex = /^[a-zA-Z ]+$/; // Permite letras de A-Z e espaços
    return regex.test(nome);
  }

const validateEmailUtils = async (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

const validatePasswordUtils = async (senha) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(senha);
  }

const validateFieldsUtils = async (objeto, camposObrigatorios) => {

    const camposFaltando = Object.keys(camposObrigatorios).filter(
        campo => !objeto[campo]
      );
    
      if (camposFaltando.length > 0) {
        const mensagens = camposFaltando.map(
          campo => `${camposObrigatorios[campo]} é obrigatório!`
        );
        return mensagens.join(" ");
      }
    
      return null;
}

module.exports = {
    validateNameUtils,
    validateEmailUtils,
    validatePasswordUtils,
    validateFieldsUtils
}