const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    read: {
        type: Boolean
    }
})

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification