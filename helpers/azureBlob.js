const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage Connection string is not set in .env file');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

async function uploadFile(containerName, fileName, fileBuffer, mimeType) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    const uploadBlobResponse = await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });

    console.log(`Upload successful: ${uploadBlobResponse.requestId}`);
    return blockBlobClient.url;
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw new Error('Failed to upload file');
  }
}

async function downloadFile(containerName, fileName) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(fileName);

    const downloadResponse = await blobClient.download(0);
    const downloadedBuffer = await streamToBuffer(downloadResponse.readableStreamBody);

    return downloadedBuffer;
  } catch (error) {
    console.error('Error downloading file:', error.message);
    throw new Error('Failed to download file');
  }
}

// Helper to convert a readable stream to a buffer
async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

module.exports = { uploadFile, downloadFile };
