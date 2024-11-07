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

    async validate(token) {
        try {
            const result = await knex("passwordstokens").select().where({ token });
    
            if (result.length > 0) {
                const tk = result[0];
            
                if (tk.used) {
                    return { status: false };
                } else {
                    return { status: true, token: tk };
                }
            } else {
                return { status: false, message: "Token not found" };
            }
        } catch (err) {
            console.log(err);
            return { status: false, message: "An error occurred" };
        }
    }
    

    
}

module.exports = new PasswordToken();