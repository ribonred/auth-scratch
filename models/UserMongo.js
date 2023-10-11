const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

exports.PermissionMongo = model("Permission", new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    permission_type: {
        type: String,
        enum: ['object', 'role'],
        default: 'role'
    }
}));

exports.UserMongo = model("User", new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],

}, {
    methods: {
        has_perm(name) {
            return this.permissions.filter((perm) => perm.name === name).length > 0;
        },
        is_superuser() {
            return this.has_perm("superuser");
        }
    }
}));