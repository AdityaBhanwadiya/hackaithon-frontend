import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import './FileUploader.css';

function FileUploader({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const sasToken = "sp=cwl&st=2025-03-22T22:19:20Z&se=2025-03-23T06:19:20Z&sv=2024-11-04&sr=c&sig=WoTR4RK7uW3XTH%2FhEc6DuzT0bhOMzbl4x04PTien8iU%3D";
  const storageAccountName = "newincomingblobsstorage";
  const containerName = "newblobstorage";

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setIsUploading(true);

    try {
      const blobServiceClient = new BlobServiceClient(
        `https://${storageAccountName}.blob.core.windows.net?${sasToken}`
      );
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(selectedFile.name);

      await blockBlobClient.uploadBrowserData(selectedFile, {
        blobHTTPHeaders: { blobContentType: selectedFile.type },
      });

      alert('File uploaded successfully!');
      onUploadSuccess(); // Call the callback function to indicate success
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container">
      <h1>Upload Your Document</h1>
      <form onSubmit={handleUpload} className="form-inline justify-content-center">
        <label className="custom-file-upload">
          Choose File
          <input
            type="file"
            className="form-control-file"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            required
          />
        </label>
        <div className="form-group mb-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
      {isUploading && <div className="loader"></div>}
    </div>
  );
}

export default FileUploader;