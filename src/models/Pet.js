const mongoose = require('mongoose');
const { Schema, model } = mongoose;


// Modelo de mascota
const mascotaSchema = new Schema({
    name: {type: String, required: true},
    animo: {type: String, required: true},
    dueño: {type: String, required: true},
}, {
    timestamps: true
});

const Mascota = model("Mascota", mascotaSchema, "mascotas");

module.exports = Mascota;