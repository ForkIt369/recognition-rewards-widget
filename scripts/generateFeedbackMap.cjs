// Node.js script to parse FeedbackUpdate.csv and output feedbackMap.json
const fs = require('fs');
const path = require('path');
const csvFile = path.join(__dirname, '../public/FeedbackUpdate.csv');
const outputFile = path.join(__dirname, '../src/feedbackMap.json');

// Try to auto-detect delimiter (tab or comma)
function detectDelimiter(headerLine) {
  if (headerLine.includes('\t')) return '\t';
  if (headerLine.includes(',')) return ',';
  return ','; // fallback
}

function parseCSVLine(line, delimiter) {
  // crude split, does not handle quoted delimiters
  return line.split(delimiter);
}

function main() {
  const lines = fs.readFileSync(csvFile, 'utf8').split(/\r?\n/);
  if (lines.length < 2) {
    console.error('CSV file too short');
    process.exit(1);
  }
  const headerLine = lines[0];
  const delimiter = detectDelimiter(headerLine);
  const headers = parseCSVLine(headerLine, delimiter);

  // Find relevant column indices
  const entryIdIdx = headers.findIndex(h => h.toLowerCase().includes('entry id'));
  const metisReqIdx = headers.findIndex(h => h.toLowerCase().includes('metis reward request'));
  const feedbackIdx = headers.findIndex(h => h.toLowerCase().includes('voyage feedback'));
  const suggestionsIdx = headers.findIndex(h => h.toLowerCase().includes('voyage suggestions'));

  if (entryIdIdx === -1) {
    console.error('Entry Id column not found');
    process.exit(1);
  }

  const map = {};

  for (let i = 1; i < lines.length; ++i) {
    const line = lines[i];
    if (!line.trim()) continue;
    const cols = parseCSVLine(line, delimiter);
    const entryId = cols[entryIdIdx];
    if (!entryId) continue;
    map[entryId] = {
      metisRequest: metisReqIdx !== -1 ? cols[metisReqIdx] : '',
      feedback: feedbackIdx !== -1 ? cols[feedbackIdx] : '',
      suggestions: suggestionsIdx !== -1 ? cols[suggestionsIdx] : ''
    };
  }

  fs.writeFileSync(outputFile, JSON.stringify(map, null, 2), 'utf8');
  console.log('feedbackMap.json generated with', Object.keys(map).length, 'entries');
}

main();
