# Recognition Rewards Widget System Architecture

## Component Architecture
1. **App.jsx (Root Component)**
   - Manages global state
   - Handles data loading and processing
   - Controls pagination logic
   - Coordinates component interactions

2. **ProfileModal.jsx**
   - Displays detailed user information
   - Manages modal state and animations
   - Handles user profile data presentation
   - Implements responsive layout
   - Renders feedback and contributor requests

3. **Pagination.jsx**
   - Controls page navigation
   - Manages page state
   - Implements efficient pagination logic
   - Provides user feedback

4. **FeedbackShowcase.jsx**
   - Displays aggregated feedback information
   - Presents user testimonials and suggestions
   - Implements animation and transition effects

5. **VoyageOverviewModal.jsx**
   - Shows comprehensive voyage statistics
   - Visualizes participation metrics
   - Displays contribution activity
   - Provides global participation view

## Design Patterns
1. **State Management**
   - React hooks for local state
   - Props for component communication
   - Centralized data flow
   - Controlled components

2. **Component Patterns**
   - Presentational components
   - Container components
   - Higher-order components
   - Custom hooks

3. **Event Handling**
   - Delegated events
   - Debounced handlers
   - Error boundaries
   - Loading states

4. **Data Processing**
   - CSV parsing and transformation
   - JSON data mapping
   - Feedback association by entry ID
   - Data anonymization and privacy protection

## Technical Decisions
1. **Framework Choice**
   - React for component architecture
   - Vite for build tooling
   - CSS Modules for styling
   - GitHub for version control

2. **Performance Optimizations**
   - Pagination for large datasets
   - Lazy loading of modals
   - Optimized state updates
   - Efficient DOM updates

3. **Styling Approach**
   - CSS Variables for theming
   - Mobile-first responsive design
   - BEM naming convention
   - Modular CSS architecture

4. **Data Protection**
   - Masked sensitive information
   - Privacy-aware data display
   - Controlled data exposure
   - Configurable privacy settings

## Data Flow
1. **Core Data Loading**
   ```
   JSON Data → App Component → User List → Individual Users
                           ↓
                    Profile Modal
   ```

2. **Feedback Integration**
   ```
   FeedbackUpdate.CSV → generateFeedbackMap.cjs → feedbackMap.json
                                                      ↓
                                               ProfileModal Component
   ```

3. **Data Verification**
   ```
   recognition-data.json → generateMasterCsv.cjs → master_participant_data.csv
   ```

4. **State Updates**
   ```
   User Interaction → State Change → Component Re-render → UI Update
   ```

5. **Event Flow**
   ```
   User Click → Event Handler → State Update → UI Refresh
   ```

## Integration Points
1. **External Systems**
   - GitHub repository
   - Vercel deployment
   - Static hosting
   - Iframe embedding

2. **Data Sources**
   - `recognition-data.json`: Core user data and metrics
   - `feedbackMap.json`: User feedback and contributor requests
   - Python-processed CSV files: Enriched user data
   - `master_participant_data.csv`: Verification export

## Data Schema
1. **Core User Profile**
   - `Entry Id`: Unique identifier (format: `UserID::CampaignID`)
   - `Total BITS`: Main performance metric
   - `Total Actions`: Contribution count
   - `Active Days`: Engagement frequency
   - `Total Referrals`: Network growth metric
   - Social identifiers: Twitter, Discord, Telegram, etc.
   - Wallet addresses: For rewards distribution
   - Tier assignment: Based on performance metrics

2. **Feedback Data**
   - Mapped by `Entry Id` for exact matching
   - `metisRequest`: Contributor reward request
   - `feedback`: User feedback about the voyage
   - `suggestions`: User improvement suggestions

3. **Activity Metrics**
   - Contribution history by date
   - Action counts and types
   - Referral performance metrics
   - Quality scores

## Processing Scripts
1. **`generateFeedbackMap.cjs`**
   - Parses feedback CSV data
   - Creates JSON mapping by Entry Id
   - Extracts relevant feedback fields
   - Formats data for frontend consumption

2. **`generateMasterCsv.cjs`**
   - Extracts all user data for verification
   - Maps key profile information
   - Includes wallet addresses and social identifiers
   - Creates verification-ready CSV format
