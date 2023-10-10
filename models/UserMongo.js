const mongoose = require('mongoose');
mongoose.connect('mongodb://user:password@127.0.0.1:27017/trial');
const { Schema } = require("mongoose");
const { default: mongoose } = require("mongoose");
// const userSchema = new Schema({
//     username: { type: String, required: true, unique: true },
//     email: String,
//     password: String
// });