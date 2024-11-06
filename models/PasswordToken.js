var knex = require("../database/connection");
var user = require("./User");

class PasswordToken {
    async create(email) {
        var users = await user.findByEmail(email);
        if (users != undefined) {
            var token = Date.now();
            try {
                await knex.insert({
                    user_id: users.id,
                    used: 0,
                    token: token
                }).table("passwordstokens")
                return {status: true, token: token}
            } catch (error) {
                console.log(error)
                return {status: false, erro: error}
            }
        } else {
            return {status: false, erro: "Usuario não encontrado"}
        }
    }
}

module.exports = new PasswordToken();