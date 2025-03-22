import React, { useState } from 'react';
import FileUploader from './upload/FileUploader';
import SuccessPage from './success/SuccessPage';

function App() {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSuccess = () => {
    setUploadSuccess(true);
  };

  return (
    <div className="App">
      {uploadSuccess ? <SuccessPage /> : <FileUploader onUploadSuccess={handleUploadSuccess} />}
    </div>
  );
}

export default App;