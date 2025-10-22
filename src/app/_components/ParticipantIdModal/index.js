"use client";

import { useState } from "react";
import "./style.css";

const ParticipantIdModal = ({ onSubmit }) => {
  const [participantId, setParticipantId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedId = participantId.trim();

    if (!trimmedId) {
      setError("Please enter a participant ID");
      return;
    }

    // Basic validation: alphanumeric, dashes, underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedId)) {
      setError("Participant ID can only contain letters, numbers, dashes, and underscores");
      return;
    }

    onSubmit(trimmedId);
  };

  const handleSkip = () => {
    // Generate random ID
    const randomId = `P${Date.now().toString().slice(-6)}`;
    onSubmit(randomId);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Participant Identification</h2>
        <p>Please enter a participant ID to begin the interview.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="participantId">Participant ID:</label>
            <input
              id="participantId"
              type="text"
              value={participantId}
              onChange={(e) => {
                setParticipantId(e.target.value);
                setError("");
              }}
              placeholder="e.g., P001, P002, SUBJ001"
              autoFocus
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="button-group">
            <button type="submit" className="btn-primary">
              Start Interview
            </button>
            <button type="button" onClick={handleSkip} className="btn-secondary">
              Generate Random ID
            </button>
          </div>
        </form>

        <div className="help-text">
          <small>
            The participant ID will be used to save and organize interview transcripts.
            It should be unique for each participant.
          </small>
        </div>
      </div>
    </div>
  );
};

export default ParticipantIdModal;
