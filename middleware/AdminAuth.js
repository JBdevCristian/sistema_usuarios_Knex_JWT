const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || "asldksadkasçldk"; // Use an environment variable for the secret

module.exports = function (req, res, next) {
    const authToken = req.headers['authorization'];

    // Check if Authorization header is present
    if (!authToken) {
        return res.status(403).json({ message: "Você não está autenticado" });
    }

    // Ensure the header follows the "Bearer <token>" format
    const bearer = authToken.split(' ');
    if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
        return res.status(400).json({ message: "Formato do token inválido" });
    }

    const token = bearer[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, secret);

        // Check user role
        if (decoded.role === 1) {
            console.log("Token decodificado:", decoded);
            next(); // Proceed to the next middleware or route handler
        } else {
            return res.status(403).json({ message: "Você não tem permissão para isso!" });
        }

    } catch (error) {
        console.error("Erro ao verificar o token:", error.message);
        return res.status(403).json({ message: "Token inválido ou expirado" });
    }
};
