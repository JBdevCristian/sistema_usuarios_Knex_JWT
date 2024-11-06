var knex = require("../database/connection");
var bcrypt = require("bcrypt");

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
    
}

module.exports = new User();