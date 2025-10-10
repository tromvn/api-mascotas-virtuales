const router = require('express').Router();
const { 
    listAllMascotas,
    getById,
    getByName,
    createMascota,
    updateById,
    updateByName,
    deleteById,
    deleteByName
 } = require('../controllers/petController');



// Listando todas las mascotas
router.get('/pets', listAllMascotas);

// Buscando por el ID
router.get('/pets/id/:id', getById);

// Buscando por el nombre
router.get('/pets/name/:name', getByName);

// Registrando
router.post('/pets', createMascota);

// Actualizando datos de la mascota por ID
router.put('/pets/id/:id', updateById);

// Actualizando datos de la mascota por nombre
router.put('/pets/name/:name', updateByName);

// Eliminando una mascota...
router.delete('/pets/id/:id', deleteById);

// Eliminando una mascota con su nombre...
router.delete('/pets/name/:name', deleteByName);



module.exports = router