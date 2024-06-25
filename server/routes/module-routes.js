const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/module-controllers');

router.get('/', moduleController.getAllModules);
router.get('/:id', moduleController.getModuleById);
router.post('/', moduleController.createModule);

module.exports = router;