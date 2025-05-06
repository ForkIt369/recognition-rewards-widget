// Node.js script to generate a master CSV from recognition-data.json
const fs = require('fs').promises;
const path = require('path');

const inputFile = path.join(__dirname, '../src/recognition-data.json');
const outputFile = path.join(__dirname, '../master_participant_data.csv');

// Define the headers for the CSV file
const headers = [
  'Entry Id',
  'User ID',
  'Whitelisted Wallet Address',
  'web3',
  'Email',
  'Email Whitelist',
  'Twitter',
  'Telegram',
  'Discord',
  'Total BITS',
  'Total Contributions', // Assuming this maps to 'Total Actions'
  'Active Days',
  'Avg Weekly Actions',
  'Total Referrals',
  'Referral Contribution Count',
  'Referral Quality Score (BITS)',
  'Is Referrer',
  'Tier',
  'Rank'
];

// Function to safely get a value from the user object
const getValue = (user, key, defaultValue = '') => {
  // Handle potential alternative keys like 'Total BITS_x'
  if (key === 'Total BITS' && !user[key]) {
    return user['Total BITS_x'] || defaultValue;
  }
  // Map 'Total Contributions' to 'Total Actions' if needed
  if (key === 'Total Contributions' && !user[key]) {
      return user['Total Actions'] || defaultValue;
  }
  return user[key] !== undefined && user[key] !== null && user[key] !== 'NaN' ? user[key] : defaultValue;
};

// Function to escape CSV values (basic implementation for quotes)
const escapeCsvValue = (value) => {
  const strValue = String(value);
  if (strValue.includes('"') || strValue.includes(',') || strValue.includes('\n') || strValue.includes('\r')) {
    return `"${strValue.replace(/"/g, '""')}"`;
  }
  return strValue;
};

async function main() {
  try {
    console.log(`Reading data from ${inputFile}...`);
    const jsonData = await fs.readFile(inputFile, 'utf8');
    const users = JSON.parse(jsonData);
    console.log(`Successfully read ${users.length} user records.`);

    // Prepare CSV content
    let csvContent = headers.map(escapeCsvValue).join(',') + '\n';

    // Process each user
    users.forEach((user, index) => {
      const userId = (getValue(user, 'Entry Id').split('::')[0] || '');
      const row = [
        getValue(user, 'Entry Id'),
        userId,
        getValue(user, 'Whitelisted Wallet Address'),
        getValue(user, 'web3'),
        getValue(user, 'Email'),
        getValue(user, 'Email Whitelist'),
        getValue(user, 'Twitter'),
        getValue(user, 'Telegram'),
        getValue(user, 'Discord'),
        getValue(user, 'Total BITS'),
        getValue(user, 'Total Contributions'), // Maps to 'Total Actions' if needed
        getValue(user, 'Active Days'),
        getValue(user, 'Avg Weekly Actions'),
        getValue(user, 'Total Referrals'),
        getValue(user, 'Referral Contribution Count'),
        getValue(user, 'Referral Quality Score (BITS)'),
        getValue(user, 'Is Referrer'),
        getValue(user, 'tier'), // Assuming 'tier' is added by assignTiers
        getValue(user, 'rank')  // Assuming 'rank' is added
      ];
      csvContent += row.map(escapeCsvValue).join(',') + '\n';
    });

    // Write the CSV file
    await fs.writeFile(outputFile, csvContent, 'utf8');
    console.log(`Successfully generated ${outputFile} with ${users.length} participant records.`);

  } catch (error) {
    console.error('Error generating master CSV:', error);
    process.exit(1);
  }
}

main();
