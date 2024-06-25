const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video-controllers');

router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.post('/', videoController.createVideo);

module.exports = router;
