"use client";

import { useState, useEffect } from "react";
import "./style.css";

const PasswordGate = ({ onAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated in this session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuthenticated = sessionStorage.getItem("demo_authenticated");
      if (isAuthenticated === "true") {
        onAuthenticated();
      }
    }
  }, [onAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Verify password with backend
      const response = await fetch("/api/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.authenticated) {
        // Store authentication in session
        sessionStorage.setItem("demo_authenticated", "true");
        onAuthenticated();
      } else {
        setError("Incorrect password. Please try again.");
        setPassword("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Password verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-gate-overlay">
      <div className="password-gate-content">
        <div className="password-gate-icon">🔒</div>
        <h2>Demo Access</h2>
        <p>Please enter the password to access the interview chatbot demo.</p>

        <form onSubmit={handleSubmit}>
          <div className="password-form-group">
            <label htmlFor="demoPassword">Password:</label>
            <input
              id="demoPassword"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter demo password"
              autoFocus
              disabled={isLoading}
            />
            {error && <div className="password-error-message">{error}</div>}
          </div>

          <button
            type="submit"
            className="password-btn-primary"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? "Verifying..." : "Access Demo"}
          </button>
        </form>

        <div className="password-help-text">
          <small>
            This demo is password-protected. Contact the researcher for access credentials.
          </small>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
