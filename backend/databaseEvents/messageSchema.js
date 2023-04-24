const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    senderID: { type: mongoose.Schema.Types.ObjectId, require: true },
    message: { type: String, require }
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;