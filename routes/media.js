const express = require('express');
const multer = require('multer');
const { uploadFile, downloadFile } = require('../helpers/azureBlob');
const auth = require('../middlewares/auth'); // Use your existing auth middleware
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

// Upload Media
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'File is required.' });
    }

    const containerName = process.env.AZURE_CONTAINER_NAME; // Your Azure Blob container name

    const fileUrl = await uploadFile(containerName, file.originalname, file.buffer, file.mimetype);

    res.status(201).json({ message: 'File uploaded successfully', fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
});

// Download Media
router.get('/download/:fileName', auth, async (req, res) => {
  try {
    const { fileName } = req.params;

    const containerName = 'media'; // Your Azure Blob container name
    const fileBuffer = await downloadFile(containerName, fileName);

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(fileBuffer);
  } catch (error) {
    console.error('Error downloading file:', error.message);
    res.status(500).json({ error: 'Failed to download file.' });
  }
});

module.exports = router;
