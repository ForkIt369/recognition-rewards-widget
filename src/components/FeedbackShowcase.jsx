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

const FEEDBACK_FIELDS = [
  { key: "Voyage Feedback", label: "Feedback", icon: "📝" },
  { key: "Voyage Suggestions", label: "Suggestions", icon: "💡" },
  { key: "Metis Reward Request", label: "Reward Request", icon: "🎁" },
  { key: "Future Hyperion Voyage Hype Level?", label: "Hype Level", icon: "🚀" }
];

const FeedbackShowcase = ({ csvText, onClose }) => {
  // Memoize parsing for performance
  const feedbackEntries = useMemo(() => {
    if (!csvText) return [];
    const rows = parseCSV(csvText);
    // Group by Entry Id, collect all fields
    const byId = {};
    rows.forEach(row => {
      const id = row["Entry Id"] || row["entry id"] || row["ID"] || "";
      if (!id) return;
      if (!byId[id]) byId[id] = { id, fields: {} };
      FEEDBACK_FIELDS.forEach(f => {
        const val = (row[f.key] || "").trim();
        if (val && val.length > 2 && !["!", "yes", "no", "ok", "a", "x", "1", "top", "good", "nice", "test"].includes(val.toLowerCase())) {
          byId[id].fields[f.key] = val;
        }
      });
    });
    // Only keep entries with at least one non-empty field
    return Object.values(byId).filter(entry => Object.keys(entry.fields).length > 0);
  }, [csvText]);

  // Pick the best (most complete, longest) feedbacks
  const bestFeedbacks = useMemo(() => {
    // Sort by number of fields, then by total length of all fields
    return [...feedbackEntries]
      .sort((a, b) => {
        const aFields = Object.values(a.fields).join(" ");
        const bFields = Object.values(b.fields).join(" ");
        if (Object.keys(b.fields).length !== Object.keys(a.fields).length) {
          return Object.keys(b.fields).length - Object.keys(a.fields).length;
        }
        return bFields.length - aFields.length;
      })
      .slice(0, 12);
  }, [feedbackEntries]);

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
                {FEEDBACK_FIELDS.map(f =>
                  bestFeedbacks[activeIndex].fields[f.key] ? (
                    <div key={f.key} style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 20, marginRight: 6 }}>{f.icon}</span>
                      <span style={{ fontWeight: 600, color: "#00bfff" }}>{f.label}:</span>
                      <span style={{ marginLeft: 6, fontStyle: "italic" }}>
                        {bestFeedbacks[activeIndex].fields[f.key]}
                      </span>
                    </div>
                  ) : null
                )}
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
