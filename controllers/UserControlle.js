var user = require("../models/User");
var passwordToken = require("../models/PasswordToken")
var jwt = require('jsonwebtoken');
var bcrypt = require("bcrypt");

var secret = "asldksadkasçldk";


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

    async edit(req, res) {
        var {id, name, email, role} = req.body;
        var result = await user.update(id, name, email, role);
        if (result != undefined) {
            if (result.status) {
                res.send("Update realizado")
            } else {
                res.status(406);
                res.send(result.err)
            }
        } else {
            res.status(406);
            res.send("Ocorreu um erro")
        }
    }

    async remove(req, res) {
        try {
            const id = req.params.id;
            const result = await user.delete(id);
    
            if (result.status) {
                return res.status(200).send("Usuário deletado");
            } else {
                const errorMessage = result.error || "Ocorreu um erro ao tentar deletar o usuário";
                return res.status(406).send(errorMessage);
            }
        } catch (error) {
            // Handle unexpected errors
            return res.status(500).send("Erro interno do servidor");
        }
    }
    

    async recoverPassword(req, res) {
        var email = req.body.email;
        var result = await passwordToken.create(email);

        if (result.status) {
            res.status(200)
            res.send("" + result.token)
        } else {
            res.status(406)
            res.send(result.erro)
        }
    }

    async changedPassword(req, res) {
        const token = req.body.token;
        const newPassword = req.body.password;
    
        try {
            // Valida o token
            const isTokenValid = await passwordToken.validate(token);
    
            if (isTokenValid.status) {
                // Chama a função para mudar a senha
                const changePasswordResult = await user.changePassword(newPassword, isTokenValid.token.user_id, token);
    
                // Responde com sucesso
                res.status(changePasswordResult.status).send(changePasswordResult.message);
            } else {
                // Responde com erro de token inválido
                res.status(406).send('Token inválido');
            }
        } catch (error) {
            console.error('Erro ao processar a mudança de senha:', error);
            res.status(500).send('Erro ao alterar senha');
        }
    }

    async login(req, res) {
        try {
            var {email, password} = req.body;

            var usuario = await user.findByEmail(email);

            if(usuario != undefined) {
                var resultado = await bcrypt.compare(password, usuario.password);
                if (resultado) {
                    var token = jwt.sign({email: usuario.email, role: usuario.role}, secret);

                    res.status(200);
                    res.json({token: token})

                } else {
                    res.status(406);
                    res.send("Senha incorreta")
                }
                res.json({status: resultado})
            } else {
                
                res.json({status: false})
            }
        } catch (error) {
            console.log(error)
        }
    }
    
}

module.exports = new UserController();