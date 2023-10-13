const mongoose = require("mongoose")

//Define schema
const AdminSchema = new mongoose.Schema({
    username: String,
    password: String,

});

const AdminCollection = mongoose.model("Admin1", AdminSchema);

module.exports = AdminCollection;