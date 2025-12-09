const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) return res.status(401).json({ msg: "No hay token" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.rol !== "Administrador") {
            return res.status(403).json({ msg: "No autorizado" });
        }

        req.user = decoded;
        next();

    } catch (err) {
        return res.status(401).json({ msg: "Token inválido" });
    }
};
