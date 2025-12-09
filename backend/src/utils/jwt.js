const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'fallback_secret';

module.exports = {
    sign(payload, expiresIn = '24h') {
        return jwt.sign(payload, SECRET, { expiresIn });
    }
};
