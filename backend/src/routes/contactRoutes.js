const express = require('express');
const router = express.Router();
const multer = require('multer');
const contactController = require('../controllers/contactController');

// Multer config for CSV uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), contactController.uploadContacts);
router.get('/', contactController.getContacts);

module.exports = router;
