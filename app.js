const express = require('express');
const app = express();
const applyMiddleware = require('./middleware');
const User = require('./models/User');
const permissons = require('./permission');


applyMiddleware(app);



app.get('/', (req, res) => {
    res.send('Hello World!');
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
    console.log(username, password);
    const user = await User.get({ username });
    if (!user) return res.status(401).json({ message: "Invalid username or password" });
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
    res.json(user);
});

const server = app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
module.exports = server;