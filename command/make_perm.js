const { PermissionMongo } = require('../models/UserMongo');
const mongoose = require("mongoose");
require('dotenv').config()

const main = async () => {
    mongoose.connect(process.env.MONGO_URL).then(() => console.log("Successfully connect to MongoDB."))
        .catch(err => console.error("Connection error", err));
    const permissions = [
        {
            name: "superuser",
            description: "admin roles",
            permission_type: "role"
        },
        {
            name: "user",
            description: "user roles",
            permission_type: "role"
        },
        {
            name: "staff",
            description: "staff roles",
            permission_type: "role"
        }
    ]
    try {
        const writer = permissions.map((permission) =>
        ({
            updateOne: {
                filter: { name: permission.name },
                update: { $set: permission },
                upsert: true,
                setDefaultsOnInsert: true
            }
        })
        )
        await PermissionMongo.bulkWrite(writer);

    } catch (e) {
        console.log(e);
    } finally {
        mongoose.connection.close();
    }
};
main();