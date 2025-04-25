/**
 * Mask an email address for privacy
 * @param {string} email - Full email address
 * @returns {string} - Masked email
 */
export const maskEmail = (email) => {
  if (!email || email === "NaN") return "";
  
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  // Show first 2 characters of username, mask the rest
  const maskedUsername = username.substring(0, 2) + '***';
  
  // Split domain into name and TLD
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return `${maskedUsername}@${domain}`;
  
  const domainName = domainParts[0];
  const tld = domainParts.slice(1).join('.');
  
  // Show first 2 characters of domain name, mask the rest
  const maskedDomain = domainName.substring(0, 2) + '***';
  
  return `${maskedUsername}@${maskedDomain}.${tld}`;
};

/**
 * Mask a wallet address for privacy
 * @param {string} address - Full wallet address
 * @returns {string} - Masked address
 */
export const maskWalletAddress = (address) => {
  if (!address || address === "NaN") return "";
  
  if (address.length < 10) return address;
  
  // Show first 6 and last 4 characters
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Mask a username or handle for privacy
 * @param {string} username - Full username
 * @returns {string} - Masked username
 */
export const maskUsername = (username) => {
  if (!username || username === "NaN") return "";
  
  // If username has less than 4 characters, don't mask
  if (username.length < 4) return username;
  
  // Show first 2 characters, mask the middle, show last character
  return `${username.substring(0, 2)}${'*'.repeat(Math.min(username.length - 3, 3))}${username.substring(username.length - 1)}`;
};

/**
 * Get masked value based on data type
 * @param {string} value - Value to mask
 * @param {string} type - Type of data ('email', 'wallet', 'discord', etc.)
 * @returns {string} - Masked value
 */
export const getMaskedValue = (value, type) => {
  if (!value || value === "NaN") return "";
  
  switch (type) {
    case 'email':
      return maskEmail(value);
      
    case 'wallet':
      return maskWalletAddress(value);
      
    case 'discord':
      if (value.includes('#')) {
        const [name, discriminator] = value.split('#');
        return `${maskUsername(name)}#${discriminator}`;
      }
      return maskUsername(value);
      
    case 'telegram':
      if (value.startsWith('@')) {
        return `@${maskUsername(value.substring(1))}`;
      }
      return maskUsername(value);
      
    case 'twitter':
      // Twitter handles are public - no masking needed
      return value;
      
    default:
      return value.length > 6 ? 
        `${value.substring(0, 3)}...${value.substring(value.length - 3)}` : 
        value;
  }
};
