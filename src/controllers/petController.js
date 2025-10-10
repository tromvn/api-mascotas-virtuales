const Mascota = require('../models/Pet');


// Listando todas las mascotas
const listAllMascotas = async (req, res) => {

    const pet = await Mascota.find();

    if (pet.length == 0) {
        return res.status(404).json({
            msg: "No se encontraron mascotas!"
        })
    };

    res.status(200).json({
        msg: "Petición correcta",
        data: pet
    });
};


// Buscando por el ID
const getById = async (req, res) => {
    
    const pet = await Mascota.findById(req.params.id);

    if (!pet) {
        return res.status(404).json({
            msg: "No se encontró esta mascota!"
        })
    };

    res.status(200).json({
        msg: "Petición correcta",
        data: pet
    });
}


// Buscando por el nombre
const getByName = async (req, res) => {
    
    const pet = await Mascota.findOne({name: req.params.name});

    if (!pet) {
        return res.status(404).json({
            msg: "No se encontró esta mascota!"
        })
    };

    res.status(200).json({
        msg: "Petición correcta",
        data: pet
    });
}


// Registrando
const createMascota = async (req, res) => {

    try {
        if (Array.isArray(req.body)) {
            const petsCreated = await Mascota.insertMany(req.body);

            return res.status(201).json({
                msg: `Se han registrado ${petsCreated.length} mascotas`,
                data: petsCreated
            });
        } else {
            const newPet = {
                name: req.body.name,
                animo: req.body.animo,
                dueño: req.body.dueño
            };

            const petCreated = await Mascota.create(newPet);

            res.status(201).json({
                msg: "Tu mascota se ha registrado",
                data: petCreated
            });
        }    
        } catch (error) {
        res.status(500).json({
            msg: "Error al registrar las mascotas",
            error: error.message
        });
        }
    
};


// Actualizando datos de la mascota por ID
const updateById = async (req, res) => {

    const pet = await Mascota.findByIdAndUpdate(req.params.id, {animo: req.body.animo});

    if (!pet) {
        return res.status(404).json({
            msg: "No se encontró esta mascota!"
        })
    };

    res.status(200).json({
        msg: "Actualización correcta",
        data: pet
    });    
};


// Actualizando datos de la mascota por nombre
const updateByName = async (req, res) => {

    const pet = await Mascota.findOneAndUpdate({name: req.params.name}, {animo: req.body.animo});

    if (!pet) {
        return res.status(404).json({
            msg: "No se encontró esta mascota!"
        })
    };

    res.status(200).json({
        msg: "Actualización correcta",
        data: pet
    });    
};


// Eliminando una mascota...
const deleteById = async (req, res) => {

    const pet = await Mascota.findByIdAndDelete(req.params.id);

    res.status(200).json({
        msg: "Tu mascota ya no está con nosotrxs",
        data: pet
    });    
};


// Eliminando una mascota con su nombre...
const deleteByName = async (req, res) => {

    const pet = await Mascota.findOneAndDelete({name: req.params.name});

    res.status(200).json({
        msg: "Tu mascota ya no está con nosotrxs",
        data: pet
    });    
};

module.exports = {
    listAllMascotas,
    getById,
    getByName,
    createMascota,
    updateById,
    updateByName,
    deleteById,
    deleteByName
};