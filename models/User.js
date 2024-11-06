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
            var result = await knex.select(["id", "name", "email", "role"]).where({Id: id}).table("users");
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
}

module.exports = new User();