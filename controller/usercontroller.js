const User = require("../models/User");

exports.login = async (req, res) => { 
    const { username, password } = req.body;
    const user = await User.get({ username });
    if (!user) return res.status(401).json({ message: "Invalid username or password" });
    // if (!await User.authenticate(username, password)) return res.status(401).json({ message: "Invalid username or password" });
    const responseToken = User.generateToken(user);
    res.json(responseToken);
};