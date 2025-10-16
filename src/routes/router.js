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
router.get('/', listAllMascotas);

// Buscando por el ID
router.get('/id/:id', getById);

// Buscando por el nombre
router.get('/name/:name', getByName);

// Registrando
router.post('/', createMascota);

// Actualizando datos de la mascota por ID
router.put('/id/:id', updateById);

// Actualizando datos de la mascota por nombre
router.put('/name/:name', updateByName);

// Eliminando una mascota...
router.delete('/id/:id', deleteById);

// Eliminando una mascota con su nombre...
router.delete('/name/:name', deleteByName);



module.exports = router