var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User{
    async new(name, email, password) { //Criação de usuario
        try {
            var hash = await bcrypt.hash(password, 10);
            await knex.insert({name, email, password: hash, role: 0}).table("users");
        } catch(err) {
            console.log(err)
        }
    }

    async findEmail(email) { //Metodo de pesquisa de usuario
        try {

            var result = await knex.select("*").from("users").where({email: email});
            if(result.length > 0) {
                return true;
            } else {
                return false;
            }

        } catch(err) {
            console.log(err);
            return false;
        }
    }

    async findAll() { //Listagem de usuarios
        try {
            var result = await knex.select(["id", "name", "email", "role"]).from("users");
            return result;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async findById(id) { //Listagem de usuarios
        try {
            var result = await knex.select(["id", "name", "email", "role"]).where({id: id}).table("users");
            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async findByEmail(email) { //Listagem de usuarios
        try {
            var result = await knex.select(["id", "name", "email", "role"]).where({email: email}).table("users");
            if (result.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async update(id, name, email, role) {
        var user = await this.findById(id);
        if (user != undefined) {
    
            var editUser = {}
    
            if (email != undefined) {
                if (email != user.email) {
                    var result = await this.findEmail(email);
                    if (result == false) {
                        editUser.email = email;
                    } else {
                        return { status: false, err: "E-mail já cadastrado" }
                    }
                }
            }
    
            if (name != undefined) {
                editUser.name = name;
            }
    
            if (role != undefined) {
                editUser.role = role;
            }
    
            try {
                await knex.update(editUser).where({ id: id }).table("users");
                return { status: true }
            } catch (err) {
                return { status: false, err: err }
            }
    
        } else {
            return { status: false, err: "Usuario não existe" }
        }
    }

    async delete(id) {
        var user  = await this.findById(id)
        if (user != undefined) {
            try {
                await knex.delete().where({id: id}).table("users")
                return {status: true}
            } catch (error) {
                return {status: false, error: error}
            }
        } else {
            return {status: false, err: "usuario não encontrado"}
        }
    }

    async changePassword(newPassword, id, token) {
        try {
            // Criptografa a nova senha
            const cript = await bcrypt.hash(newPassword, 10);
    
            // Atualiza a senha no banco de dados
            await knex("users")
                .where('id', id)
                .update({ password: cript });
    
            // Marca o token como usado
            await PasswordToken.setUsed(token);
    
            // Retorno para indicar sucesso
            return { status: 200, message: 'Senha alterada com sucesso' };
        } catch (error) {
            console.error('Erro ao alterar a senha:', error);
            return { status: 500, message: 'Erro ao alterar a senha' };
        }
    }
    
    
}

module.exports = new User();