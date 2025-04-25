# Recognition Rewards Widget Technical Context

## Development Environment
- Node.js environment
- VSCode as primary IDE
- Git for version control
- npm for package management

## Technology Stack
1. **Frontend Framework**
   - React 18
   - Vite 6.3.2
   - JavaScript/JSX

2. **Styling**
   - Pure CSS with variables
   - BEM methodology
   - Responsive design
   - Mobile-first approach

3. **Build Tools**
   - Vite for development and build
   - ESLint for code quality
   - npm scripts for automation

## Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "vite": "^6.3.2"
  }
}
```

## Development Setup
1. **Local Development**
   ```bash
   npm install
   npm run dev
   ```

2. **Production Build**
   ```bash
   npm run build
   ```

3. **Deployment**
   - GitHub repository
   - Vercel hosting
   - Static file serving

## Project Structure
```
recognition-widget/
├── src/
│   ├── components/
│   │   ├── Pagination.jsx
│   │   └── ProfileModal.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── App.css
│   ├── index.css
│   └── recognition-data.json
├── public/
├── dist/
└── package.json
```

## Data Structure
```typescript
interface User {
  'Entry Id': string;
  'Total BITS': number;
  'Preliminary Tier': string;
  'Total Actions': number;
  'Total Referrals': number;
  'Active Days': number;
  'Avg Weekly': number;
  'Engagement Pattern': string;
}
```

## Constraints & Considerations
1. **Performance**
   - Large dataset (1,663 users)
   - Client-side pagination
   - Modal rendering optimization
   - Mobile performance

2. **Browser Support**
   - Modern browsers
   - Responsive design
   - CSS Grid/Flexbox
   - CSS Variables

3. **Security**
   - Static data only
   - No sensitive information
   - Public access
   - Read-only operations

4. **Maintenance**
   - Version control
   - Documentation
   - Component modularity
   - Code organization
