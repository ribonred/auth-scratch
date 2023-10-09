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
        const expireAt = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour
        const accesToken = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: expireAt });
        const refreshToken = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: "7d" });
        return { accesToken, refreshToken, expireAt };
    }
    static parseToken(token) {
        return jwt.verify(token, process.env.SECRET);
    }
}

module.exports = User;