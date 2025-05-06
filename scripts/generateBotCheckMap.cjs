// Node.js script to parse BotCheckAuditList.csv and output botCheckMap.json
const fs = require('fs').promises;
const path = require('path');

const inputFile = path.join(__dirname, '../../BotCheckAuditList.csv');
const outputFile = path.join(__dirname, '../src/botCheckMap.json');

// Try to auto-detect delimiter (tab or comma)
function detectDelimiter(headerLine) {
  if (headerLine.includes('\t')) return '\t';
  if (headerLine.includes(',')) return ',';
  return ','; // fallback
}

// Parse CSV line handling quoted fields properly
function parseCSVLine(line, delimiter) {
  const result = [];
  let inQuotes = false;
  let currentField = '';
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === delimiter && !inQuotes) {
      result.push(currentField);
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  // Don't forget to add the last field
  result.push(currentField);
  return result;
}

async function main() {
  try {
    console.log(`Reading data from ${inputFile}...`);
    const content = await fs.readFile(inputFile, 'utf8');
    const lines = content.split(/\r?\n/);
    
    if (lines.length < 2) {
      console.error('CSV file too short');
      process.exit(1);
    }
    
    const headerLine = lines[0];
    const delimiter = detectDelimiter(headerLine);
    const headers = parseCSVLine(headerLine, delimiter);
    
    // Find relevant column indices
    const entryIdIdx = headers.findIndex(h => h === 'Entry Id');
    const botIdx = headers.findIndex(h => h === 'Bot');
    const walletIdx = headers.findIndex(h => h === 'wallet');
    const emailIdx = headers.findIndex(h => h === 'Email');
    const emailFlagIdx = headers.findIndex(h => h === 'email_flag');
    const debankFlagIdx = headers.findIndex(h => h === 'Debank_flag');
    const txCountIdx = headers.findIndex(h => h === 'tx_count');
    const shScriptFlagIdx = headers.findIndex(h => h === 'sh_script_flag');
    const multiChainFlagIdx = headers.findIndex(h => h === 'multi-chain flag');
    const spamReferralsIdx = headers.findIndex(h => h === 'Spam Referrals');
    const spamSynergyBitsIdx = headers.findIndex(h => h === 'Spam Synergy BITS');
    const isVerifiedReferrerIdx = headers.findIndex(h => h === 'Is Verified Referrer');
    const countryIdxs = [];
    const ipIdxs = [];
    
    // Find all country and IP columns
    headers.forEach((header, idx) => {
      if (header.startsWith('Country_')) countryIdxs.push(idx);
      if (header.startsWith('IP_')) ipIdxs.push(idx);
    });
    
    if (entryIdIdx === -1) {
      console.error('Entry Id column not found');
      process.exit(1);
    }
    
    const botCheckMap = {};
    
    // Process all lines except header
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const cols = parseCSVLine(line, delimiter);
      const entryId = cols[entryIdIdx];
      
      if (!entryId) continue;
      
      // Group IPs and countries
      const countries = countryIdxs.map(idx => cols[idx]).filter(Boolean);
      const uniqueCountries = [...new Set(countries)];
      const ips = ipIdxs.map(idx => cols[idx]).filter(Boolean);
      const uniqueIPs = [...new Set(ips)];
      
      botCheckMap[entryId] = {
        isBot: cols[botIdx] === 'Yes',
        wallet: cols[walletIdx] || '',
        email: cols[emailIdx] || '',
        emailFlag: cols[emailFlagIdx] === 'bot',
        debankFlag: cols[debankFlagIdx] === 'bot',
        txCount: parseInt(cols[txCountIdx] || '0', 10),
        shScriptFlag: parseInt(cols[shScriptFlagIdx] || '0', 10) > 0,
        multiChainFlag: parseInt(cols[multiChainFlagIdx] || '0', 10) > 0,
        spamReferrals: parseInt(cols[spamReferralsIdx] || '0', 10),
        spamSynergyBits: parseFloat(cols[spamSynergyBitsIdx] || '0'),
        isVerifiedReferrer: cols[isVerifiedReferrerIdx] === 'True',
        countries: uniqueCountries,
        ips: uniqueIPs,
        // Add a composite risk score based on all flags
        riskScore: calculateRiskScore(cols, botIdx, emailFlagIdx, debankFlagIdx, shScriptFlagIdx, multiChainFlagIdx)
      };
    }
    
    await fs.writeFile(outputFile, JSON.stringify(botCheckMap, null, 2), 'utf8');
    console.log(`botCheckMap.json generated with ${Object.keys(botCheckMap).length} entries`);
    
  } catch (error) {
    console.error('Error generating bot check map:', error);
    process.exit(1);
  }
}

// Calculate a risk score based on flags (0-100)
function calculateRiskScore(cols, botIdx, emailFlagIdx, debankFlagIdx, shScriptFlagIdx, multiChainFlagIdx) {
  let score = 0;
  
  // Bot flag is the strongest indicator
  if (cols[botIdx] === 'Yes') score += 50;
  
  // Email flag
  if (cols[emailFlagIdx] === 'bot') score += 15;
  
  // Debank flag
  if (cols[debankFlagIdx] === 'bot') score += 20;
  
  // Script flag
  if (parseInt(cols[shScriptFlagIdx] || '0', 10) > 0) score += 10;
  
  // Multi-chain flag
  if (parseInt(cols[multiChainFlagIdx] || '0', 10) > 0) score += 5;
  
  return Math.min(100, score);
}

main();
