const { PrismaClient } = require("@prisma/client");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

class User {
    static async authenticate(username, rawPassword) {
        const user = await this.get({ username });
        if (!user) return false;
        const hashedPassword = this.make_password(rawPassword);
        return user.password === hashedPassword;
    }
    static make_password(password) {
        return CryptoJS.PBKDF2(password, process.env.SECRET, { keySize: 256 / 32, iterations: 1000 }).toString();
    }
    static async create({ username, email, password }) {
        return await prisma.user.create({ data: { username, email, password: password } });
    }
    static async get(fieldValuePair, options) {
        return await prisma.user.findUnique({ where: fieldValuePair, ...options });
    }
    static generateToken(user) {
        const expireAt = Math.floor(Date.now() / 1000) + (1); // 1 hour
        const accesToken = jwt.sign({ id: user.id, iat: Math.floor(Date.now() / 1000) + 10 }, process.env.SECRET, { expiresIn: expireAt });
        const refreshToken = jwt.sign({ id: user.id, iat: Math.floor(Date.now() / 1000) + (60*60) }); // 1 hour
        return { accesToken, refreshToken, expireAt };
    }
    static async parseToken(token, options) {
        const decoded = jwt.verify(token, process.env.SECRET);
        const now = Math.floor(Date.now() / 1000);
        console.log(decoded.iat, now);
        console.log(decoded.iat < now);
        if (decoded.iat < now) throw new Error("Token expired");
        const { id } = decoded; // throw error if invalid
        return await this.get({ id }, options);; // == { id:1, iat: 123123123 , exp: 123123123 }
    }
    static async parseTokenSafe(token, options) {
        try {
            return await this.parseToken(token, options);
        } catch (e) {
            console.log(e, "EXPIRE");
            return null;

        }
    }

}

module.exports = User;