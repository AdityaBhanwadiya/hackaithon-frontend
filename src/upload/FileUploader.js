import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import './FileUploader.css'; // Import the CSS file
import SuccessPage from '../success/SuccessPage';

function FileUploader() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); // State to track upload success

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setIsUploading(true);

    try {
      // Step 1: Fetch SAS token from Azure Function
      const res = await fetch("https://azure-hackathon-fa.azurewebsites.net/api/generateToken");
      const { sasToken, accountName, containerName } = await res.json();

      // Step 2: Use the token to create BlobServiceClient
      const blobService = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient = blobService.getContainerClient(containerName);
      const blobClient = containerClient.getBlockBlobClient(file.name);

      // Step 3: Upload file
      await blobClient.uploadData(file);

      alert("File uploaded successfully!");
      setUploadSuccess(true); // Set success state to true
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  // If upload is successful, render the SuccessPage
  if (uploadSuccess) {
    return <SuccessPage />;
  }

  return (
    <div className="container">
      <h1>Upload Your Document</h1>
      <div className="form-group">
        <label className="custom-file-upload">
          Choose File
          <input
            type="file"
            className="form-control-file"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
          />
        </label>
      </div>
      <div className="form-group">
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Document"}
        </button>
      </div>
      {isUploading && <div className="loader"></div>}
    </div>
  );
}

export default FileUploader;