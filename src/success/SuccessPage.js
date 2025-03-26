import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './SuccessPage.css';

function SuccessPage() {
  // Get the window dimensions for the confetti effect
  const { innerWidth: width, innerHeight: height } = window;

  // State to control the confetti effect
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Stop the confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // 3000ms = 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <div className="success-container">
      {/* Confetti Effect */}
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={500} gravity={0.5} />}

      <h1>Uploaded Successfully</h1>
      <p>Your document has been uploaded successfully and is now processing!</p>

      {/* Button for Salesforce Org */}
      <a
        href="https://login.salesforce.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-custom"
      >
        Edit Data
      </a>

      {/* Button to return to Home */}
      <a href="/" className="btn btn-home">
        Return to Home
      </a>
    </div>
  );
}

export default SuccessPage;