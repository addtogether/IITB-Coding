const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected with Mongo DB Database on : ${con.connection.host}`);
    } catch (error) {
        console.log('Error: ', error);
    }
};

module.exports = connectDb;