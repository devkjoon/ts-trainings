const Module = require('../models/module');

const getAllModules = async (req, res) => {
    try {
        const modules = await Module.find();
        res.json({ modules });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch moduels' });
    }
};

const getModuleById = async (req, res) => {
    const { id } = req.params;
    try { 
        const module = await Module.findById(id);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        res.json({ module });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch module' });
    }
}

const createModule = async (req, res) => {
    const { title } req.body;
    try {
        const module = new Module({ title });
        await module.save();
        res.status(201).json({ module });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create module' });
    }
};

module.exports = {
    getAllModules,
    getModuleById,
    createModule
}