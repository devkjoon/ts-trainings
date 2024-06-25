const Video = require('../models/video');

const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find();
        res.json({ videos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch videos' });
    }
};

const getVideoById = async (req, res) => {
    const { id } = req.params;
    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json({ video });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch video' });
    }
};

const createVideo = async (req, res) => {
    const { title, url, duration } = req.body;
    try {
        const video = new Video({ title, url, duration });
        await video.save();
        res.status(201).json({ video });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create video' });
    }
};

module.exports = {
    getAllVideos,
    getVideoById,
    createVideo
}