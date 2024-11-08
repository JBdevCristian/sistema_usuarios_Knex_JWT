var user = require("../models/User");

class UserController {
    async index(req, res) {
        var users = await user.findAll();;
        res.json(users)
    }

    async findUser(req, res) {
        var id = req.params.id;
        var users = await user.findById(id);
        if(users == undefined) {
            res.status(404);
            res.json({err: "Usuario não encontrado"});
        } else {
            res.status(200);
            res.json(users);
        }
    }

    async create(req, res) {
        
        var {name, email, password} = req.body;

        if(email == undefined || email == "") {
            res.status(400);
            res.json({err: "O e-mail é invalido"})
            return;
        }

        var emailExists = await user.findEmail(email);

        if(emailExists) {
            res.status(406);
            res.json({err: "E-mail já cadastrado"})
            return
        }

        await user.new(name, email, password);

        res.status(200);
        console.log("Usuario adicionado com sucesso")
        res.send("Usuario adicionado com sucesso")
    }
}

module.exports = new UserController();