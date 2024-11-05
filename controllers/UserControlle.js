var user = require("../models/User");

class UserController {
    async index(req, res) {

    }

    async create(req, res) {
        
        var {name, email, password} = req.body;

        if(email == undefined || email == "") {
            res.status(400);
            res.json({err: "O e-mail é invalido"})
        }

        await user.new(name, email, password);

        res.status(200);
        console.log("Usuario adicionado com sucesso")
        res.send("Pegando users da tabela")
    }
}

module.exports = new UserController();