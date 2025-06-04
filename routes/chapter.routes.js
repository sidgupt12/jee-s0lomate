const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
// const adminAuth = require('../middleware/adminAuth');

const {
  getAllChapters,
  getChapterById,
  uploadChapters
} = require('../controllers/chapterController.js');


// GET /api/v1/chapters
router.get('/', getAllChapters);

// GET /api/v1/chapters/:id
router.get('/:id', getChapterById);

// POST /api/v1/chapters (upload JSON file)
router.post('/', upload.single('file'), uploadChapters);

module.exports = router;