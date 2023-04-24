const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    profileImage: {type: String}
})

const User = mongoose.model('User', userSchema);

module.exports = User