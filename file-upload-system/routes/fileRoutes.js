// routes/fileRoutes.js
const express = require('express');
const multer = require('multer');
const {
  uploadFile,
  getFile,
  updateFile,
  downloadFile,
  deleteFile
} = require('../controllers/fileController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadFile);
router.get('/:id', getFile);
router.put('/:id', updateFile);
router.get('/download/:id', downloadFile);
router.delete('/:id', deleteFile);

module.exports = router;
