const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const User = require("./models/User");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/user', async (req, res) => {
    const { username, email, password } = req.body;
    // const user = await User.create({username, email, password});
    // const responseToken = User.generateToken(user);
    const responseToken = { "accessToken": "dummytoken" };
    res.status(201).json(responseToken);
});

const server = app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
module.exports = server;