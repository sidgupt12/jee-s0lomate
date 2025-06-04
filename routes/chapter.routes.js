const router = require('express').Router;
const upload = require('../middleware/multerConfig');
const adminAuth = require('../middleware/adminAuth');

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
router.post('/', adminAuth, upload.single('file'), uploadChapters);

module.exports = router;