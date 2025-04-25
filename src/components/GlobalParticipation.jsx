import { useState } from 'react';
import '../styles/GlobalParticipation.css';

// Country data with emoji flags
const countryData = [
  { name: "Algeria", flag: "🇩🇿" },
  { name: "Andorra", flag: "🇦🇩" },
  { name: "Angola", flag: "🇦🇴" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Bahrain", flag: "🇧🇭" },
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Benin", flag: "🇧🇯" },
  { name: "Bolivia", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { name: "Botswana", flag: "🇧🇼" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Brunei", flag: "🇧🇳" },
  { name: "Bulgaria", flag: "🇧🇬" },
  { name: "Cambodia", flag: "🇰🇭" },
  { name: "Cameroon", flag: "🇨🇲" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "China", flag: "🇨🇳" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Costa Rica", flag: "🇨🇷" },
  { name: "Croatia", flag: "🇭🇷" },
  { name: "Czech Republic", flag: "🇨🇿" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Dominican Republic", flag: "🇩🇴" },
  { name: "Ecuador", flag: "🇪🇨" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "El Salvador", flag: "🇸🇻" },
  { name: "Estonia", flag: "🇪🇪" },
  { name: "Ethiopia", flag: "🇪🇹" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "France", flag: "🇫🇷" },
  { name: "Gambia", flag: "🇬🇲" },
  { name: "Georgia", flag: "🇬🇪" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Greece", flag: "🇬🇷" },
  { name: "Guatemala", flag: "🇬🇹" },
  { name: "Hong Kong", flag: "🇭🇰" },
  { name: "Hungary", flag: "🇭🇺" },
  { name: "Iceland", flag: "🇮🇸" },
  { name: "India", flag: "🇮🇳" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "Iraq", flag: "🇮🇶" },
  { name: "Ireland", flag: "🇮🇪" },
  { name: "Israel", flag: "🇮🇱" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Jordan", flag: "🇯🇴" },
  { name: "Kazakhstan", flag: "🇰🇿" },
  { name: "Kenya", flag: "🇰🇪" },
  { name: "Korea", flag: "🇰🇷" },
  { name: "Kuwait", flag: "🇰🇼" },
  { name: "Kyrgyzstan", flag: "🇰🇬" },
  { name: "Latvia", flag: "🇱🇻" },
  { name: "Lebanon", flag: "🇱🇧" },
  { name: "Libya", flag: "🇱🇾" },
  { name: "Lithuania", flag: "🇱🇹" },
  { name: "Luxembourg", flag: "🇱🇺" },
  { name: "Macau", flag: "🇲🇴" },
  { name: "Macedonia", flag: "🇲🇰" },
  { name: "Madagascar", flag: "🇲🇬" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Mali", flag: "🇲🇱" },
  { name: "Malta", flag: "🇲🇹" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Moldova", flag: "🇲🇩" },
  { name: "Monaco", flag: "🇲🇨" },
  { name: "Mongolia", flag: "🇲🇳" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "Mozambique", flag: "🇲🇿" },
  { name: "Myanmar", flag: "🇲🇲" },
  { name: "Namibia", flag: "🇳🇦" },
  { name: "Nepal", flag: "🇳🇵" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Panama", flag: "🇵🇦" },
  { name: "Paraguay", flag: "🇵🇾" },
  { name: "Peru", flag: "🇵🇪" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Romania", flag: "🇷🇴" },
  { name: "Russia", flag: "🇷🇺" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Senegal", flag: "🇸🇳" },
  { name: "Serbia", flag: "🇷🇸" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Slovakia", flag: "🇸🇰" },
  { name: "Slovenia", flag: "🇸🇮" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Sri Lanka", flag: "🇱🇰" },
  { name: "Sudan", flag: "🇸🇩" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Taiwan", flag: "🇹🇼" },
  { name: "Tanzania", flag: "🇹🇿" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Tunisia", flag: "🇹🇳" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Uganda", flag: "🇺🇬" },
  { name: "Ukraine", flag: "🇺🇦" },
  { name: "United Arab Emirates", flag: "🇦🇪" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "United States", flag: "🇺🇸" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Uzbekistan", flag: "🇺🇿" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "Zimbabwe", flag: "🇿🇼" }
];

// Group countries by continent for visual organization
const continents = {
  'North America': ["Canada", "United States", "Mexico", "Costa Rica", "El Salvador", "Panama", "Dominican Republic", "Guatemala"],
  'South America': ["Argentina", "Brazil", "Chile", "Colombia", "Ecuador", "Paraguay", "Peru", "Uruguay", "Bolivia"],
  'Europe': ["Andorra", "Austria", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Czech Republic", "Denmark", 
             "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Latvia", 
             "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco", "Netherlands", "Norway", "Poland", 
             "Portugal", "Romania", "Russia", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", 
             "Ukraine", "United Kingdom"],
  'Asia': ["Bahrain", "Bangladesh", "Brunei", "Cambodia", "China", "Georgia", "Hong Kong", "India", "Indonesia", 
           "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Korea", "Kuwait", "Kyrgyzstan", "Lebanon", 
           "Macau", "Malaysia", "Mongolia", "Myanmar", "Nepal", "Oman", "Pakistan", "Philippines", "Qatar", 
           "Saudi Arabia", "Singapore", "Sri Lanka", "Taiwan", "Thailand", "Turkey", "United Arab Emirates", 
           "Uzbekistan", "Vietnam"],
  'Africa': ["Algeria", "Angola", "Benin", "Botswana", "Cameroon", "Egypt", "Ethiopia", "Gambia", "Ghana", 
             "Kenya", "Libya", "Madagascar", "Mali", "Morocco", "Mozambique", "Namibia", "Nigeria", "Senegal", 
             "South Africa", "Sudan", "Tanzania", "Tunisia", "Uganda", "Zimbabwe"],
  'Oceania': ["Australia", "New Zealand"]
};

/**
 * NOTE: All fake/dummy count data removed.
 * This component now only displays the list of participating countries and their flags.
 */

const GlobalParticipation = ({ onClose }) => {
  const [activeContinent, setActiveContinent] = useState('all');
  
  // Filter countries based on selected continent
  const filteredCountries = activeContinent === 'all' 
    ? countryData 
    : countryData.filter(country => continents[activeContinent]?.includes(country.name));

  return (
    <div className="global-participation-overlay">
      <div className="global-participation-modal">
        <button className="global-close-btn" onClick={onClose}>×</button>
        
        <div className="global-header">
          <h2>Global Participation</h2>
          <div className="global-subtitle">
            <img src="/robit-avatar.png" alt="Robit" className="global-robit" />
            <p>
              Metis Voyage has seen participation from <span className="highlight">{countryData.length} countries</span> across the globe!
            </p>
          </div>
        </div>
        
        <div className="global-filter">
          <button 
            className={activeContinent === 'all' ? 'active' : ''} 
            onClick={() => setActiveContinent('all')}
          >
            All Regions 🌎
          </button>
          {Object.keys(continents).map(continent => (
            <button 
              key={continent}
              className={activeContinent === continent ? 'active' : ''} 
              onClick={() => setActiveContinent(continent)}
            >
              {continent}
            </button>
          ))}
        </div>
        
        <div className="global-countries-grid">
          {filteredCountries.map(country => (
            <div key={country.name} className="global-country-card">
              <div className="global-country-flag">{country.flag}</div>
              <div className="global-country-name">{country.name}</div>
            </div>
          ))}
        </div>
        
        <div className="global-footer">
          <p>
            <span role="img" aria-label="globe">🌍</span> 
            <span className="highlight">Global participation</span> is what makes this community special!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalParticipation;
