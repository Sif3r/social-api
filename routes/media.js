const express = require('express');
const multer = require('multer');
const { uploadFile, downloadFile } = require('../helpers/azureBlob');
const auth = require('../middlewares/auth');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /media/upload:
 *   post:
 *     summary: Upload a media file
 *     description: Upload a media file (image, video, etc.) to Azure Blob Storage.
 *     tags:
 *       - Media
 *     security:
 *       - bearerAuth: [] # JWT authentication
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload.
 *     responses:
 *       201:
 *         description: File uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 fileUrl:
 *                   type: string
 *                   description: The URL of the uploaded file.
 *       400:
 *         description: File is required.
 *       500:
 *         description: Failed to upload file.
 */
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'File is required.' });
    }

    const containerName = process.env.AZURE_CONTAINER_NAME;

    const fileUrl = await uploadFile(containerName, file.originalname, file.buffer, file.mimetype);

    res.status(201).json({ message: 'File uploaded successfully', fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
});

/**
 * @swagger
 * /media/download/{fileName}:
 *   get:
 *     summary: Download a media file
 *     description: Download a file from Azure Blob Storage.
 *     tags:
 *       - Media
 *     security:
 *       - bearerAuth: [] # JWT authentication
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to download.
 *     responses:
 *       200:
 *         description: File downloaded successfully.
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found.
 *       500:
 *         description: Failed to download file.
 */
router.get('/download/:fileName', auth, async (req, res) => {
  try {
    const { fileName } = req.params;

    const containerName = process.env.AZURE_CONTAINER_NAME;

    const fileBuffer = await downloadFile(containerName, fileName);

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(fileBuffer);
  } catch (error) {
    console.error('Error downloading file:', error.message);
    res.status(500).json({ error: 'Failed to download file.' });
  }
});

module.exports = router;
