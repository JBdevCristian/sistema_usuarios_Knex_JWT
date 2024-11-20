const jwt = require('jsonwebtoken');
const secret = "asldksadkasçldk";

module.exports = function (req, res, next) {
    const authToken = req.headers['authorization'];

    if (!authToken) {
        return res.status(403).json({ message: "Você não está autenticado" });
    }

    const bearer = authToken.split(' ');
    const token = bearer[1];

    try {
        const decoded = jwt.verify(token, secret);

        // Verifica se o usuário tem permissão (role = 1)
        if (decoded.role === 1) {
            console.log(decoded);
            return next();
        } else {
            return res.status(403).json({ message: "Você não tem permissão para isso!" });
        }
    } catch (error) {
        console.error("Erro ao verificar o token:", error.message);
        return res.status(403).json({ message: "Token inválido ou expirado" });
    }
};
