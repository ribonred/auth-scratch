const express = require('express');
const app = express();
const applyMiddleware = require('./middleware');
const User = require('./models/User');
const { attachPerm, detachPerm } = require('./models/permissions_utils');
const { PermissionMongo } = require('./models/UserMongo');
const permissons = require('./permission');
const mongoose = require("mongoose");
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL).then(() => console.log("Successfully connect to MongoDB."))
    .catch(err => console.error("Connection error", err));

applyMiddleware(app);



app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post("/attachperm", async (req, res) => {
    const { username, permission } = req.body;
    const perm = await PermissionMongo.findOne({ name: permission });
    const user = await User.get({ username });
    await attachPerm(user, perm);
    res.json({message: "success"});
});
app.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;
    const user = await User.parseTokenSafe(refreshToken);
    if (!user) return res.status(401).json({ message: "Invalid token" });
    const responseToken = User.generateToken(user);
    res.json(responseToken);
});
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const is_authenticated = await User.authenticate(username, password);
    const user = await User.get({ username });
    if (!is_authenticated) return res.status(401).json({ message: "Invalid username or password" });
    const responseToken = User.generateToken(user);
    res.json(responseToken);
});
app.post('/user', async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    const responseToken = User.generateToken(user);
    res.status(201).json(responseToken);
});
// authorization
app.get("/user", permissons.is_authenticated, async (req, res) => {
    const user = req.user;
    console.log(user.is_superuser());
    console.log(user.is_staff());
    res.json(user);
});

const server = app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
module.exports = server;