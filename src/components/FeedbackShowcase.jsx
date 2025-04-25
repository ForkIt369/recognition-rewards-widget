import React, { useState, useMemo } from "react";
import "../styles/GlobalParticipation.css";

// Helper to parse CSV (simple, for this context)
function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h.trim()] = (values[idx] || "").replace(/^"|"$/g, "");
    });
    return obj;
  });
}

const FeedbackShowcase = ({ csvText, onClose }) => {
  // Memoize parsing for performance
  const feedbacks = useMemo(() => {
    if (!csvText) return [];
    const rows = parseCSV(csvText);
    // Use the "Share your individual contribution!" column
    return rows
      .map(row => row["Share your individual contribution!"] || "")
      .map(str => str.trim())
      .filter(str =>
        str.length > 10 &&
        !["!", "Yes", "no", "ok", "a", "X", "1", "top", "good", "nice", "99", "99,9", "99.9", "test"].includes(str.toLowerCase())
      );
  }, [csvText]);

  // Pick the best (longest, most thoughtful) feedbacks
  const bestFeedbacks = useMemo(() => {
    // Sort by length, then pick top 12
    return [...feedbacks]
      .sort((a, b) => b.length - a.length)
      .slice(0, 12);
  }, [feedbacks]);

  const [activeIndex, setActiveIndex] = useState(0);

  if (!csvText) {
    return (
      <div className="global-participation-overlay">
        <div className="global-participation-modal">
          <button className="global-close-btn" onClick={onClose}>×</button>
          <h2>Feedback & Suggestions</h2>
          <p>Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="global-participation-overlay">
      <div className="global-participation-modal">
        <button className="global-close-btn" onClick={onClose}>×</button>
        <div className="global-header">
          <h2>Feedback & Suggestions</h2>
          <div className="global-subtitle">
            <span role="img" aria-label="lightbulb" className="global-country-flag">💡</span>
            <p>
              Here are some of the most thoughtful contributions and suggestions from the Voyage community!
            </p>
          </div>
        </div>
        <div style={{ margin: "0 auto", maxWidth: 600 }}>
          {bestFeedbacks.length === 0 ? (
            <p>No feedback found.</p>
          ) : (
            <div>
              <div className="global-country-card" style={{ minHeight: 120, marginBottom: 16 }}>
                <div style={{ fontSize: 18, fontStyle: "italic", color: "#00bfff" }}>
                  “{bestFeedbacks[activeIndex]}”
                </div>
              </div>
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                {bestFeedbacks.map((_, idx) => (
                  <button
                    key={idx}
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      margin: "0 4px",
                      background: idx === activeIndex ? "#00bfff" : "#ccc",
                      border: "none",
                      cursor: "pointer",
                      outline: "none"
                    }}
                    aria-label={`Show feedback ${idx + 1}`}
                    onClick={() => setActiveIndex(idx)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="global-footer">
          <p>
            <span role="img" aria-label="star">⭐️</span>
            Thank you to everyone who shared their thoughts and helped shape the Voyage!
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackShowcase;
