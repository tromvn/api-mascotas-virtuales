const mongoose = require('mongoose');

dbConnection = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/express_clase1");
        console.log("Servidor DB ejecutando correctamente!");
    } catch (error) {
        console.log(error);
    }
};

module.exports = { dbConnection };