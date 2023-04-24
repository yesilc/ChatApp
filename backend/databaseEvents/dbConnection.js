const mongoose = require('mongoose');
const dotenv = require('dotenv')

dotenv.config({path: "../../config/config.env"})

const connectDatabase = () => {
    mongoose.connect("mongodb+srv://cyesilc:yesil123@cluster0.d1gnq.mongodb.net/chatApp?retryWrites=true&w=majority")
        .then(() => {
            console.log("MongoDb Connection Succesful");
        })
        .catch(err => {
            console.error(err);
        })
}

module.exports = connectDatabase;