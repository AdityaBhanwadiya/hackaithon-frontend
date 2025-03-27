import React, { useState, useEffect } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import './FileUploader.css';
import SuccessPage from '../success/SuccessPage';
import useSignalRStatus from '../hooks/useSignalRStatus';

function FileUploader() {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const status = useSignalRStatus();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile);
      setPreviewURL(preview);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    setIsUploading(true);
    setIsScanning(true);

    try {
      // Fetch SAS token from Azure Function
      const res = await fetch("https://hackaithon-fa-premium.azurewebsites.net/api/generateToken");
      const { sasToken, accountName, containerName } = await res.json();

      // Create BlobServiceClient with SAS token
      const blobService = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient = blobService.getContainerClient(containerName);
      const blobClient = containerClient.getBlockBlobClient(file.name);

      // Upload file
      await blobClient.uploadData(file);
      console.log("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (status === "Wrapping things up.....") {
      setIsScanning(false);
      // Wait a couple of seconds to let the user see the final status message
      const timer = setTimeout(() => {
        setShowSuccess(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Render the SuccessPage only if showSuccess is true.
  if (showSuccess) {
    return <SuccessPage />;
  }

  return (
    <div className="container no-scroll">
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

      {previewURL && (
        <div className="preview">
          <p>Preview:</p>
          <div className="preview-wrapper">
            {file.type === "application/pdf" ? (
              <embed
                src={previewURL}
                width="100%"
                height="200px"
                type="application/pdf"
              />
            ) : (
              <img
                src={previewURL}
                alt="Preview"
                style={{ maxWidth: "100%", height: "350px" }}
              />
            )}
            {/* Scanner Effect */}
            {isScanning && <div className="scanner-overlay"></div>}
          </div>
        </div>
      )}
      
      {status && (
        <p className="status-message">{status}</p>
      )}

      <div className="upload-section">
        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Document"}
        </button>
      </div>
    </div>
  );
}

export default FileUploader;
