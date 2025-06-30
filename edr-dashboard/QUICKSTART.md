# EDR Dashboard Quick Start Guide

## 🚀 Setup in 5 Minutes

### 1. Prerequisites Check
```bash
# Check Node.js version (requires 18+)
node --version

# Check npm version (requires 9+)
npm --version
```

### 2. Install Dependencies
```bash
cd frontend/edr-dashboard
npm install
```

### 3. Environment Setup
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_TITLE=EDR Security Dashboard
VITE_APP_VERSION=2.0.0
```

### 4. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## 📋 What's Included

### ✅ Ready-to-Use Components
- **StatusBadge**: Agent/Alert status indicators
- **DataTable**: Sortable, filterable tables
- **Charts**: Real-time data visualizations
- **Forms**: Validation-ready input forms
- **Modals**: Dialog components
- **Loading**: Spinner and skeleton components

### ✅ Pre-configured Features
- **TypeScript**: Full type safety
- **Tailwind CSS**: Custom security theme
- **React Query**: Efficient data fetching
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing
- **Form Validation**: Zod schema validation

### ✅ API Integration
- **Dashboard APIs**: Stats and overview data
- **Agent Management**: CRUD operations
- **Event Analysis**: Filtering and search
- **Alert Management**: Triage workflows
- **Threat Intelligence**: Indicator management
- **Detection Rules**: Rule configuration

## 🎯 Next Steps

### 1. Create Missing Components
Based on the structure, you'll need to create:

```bash
# Create component directories
mkdir -p src/components/{ui,layout,charts,forms,dashboard}
mkdir -p src/pages
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/store
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/styles
```

### 2. Essential Components to Build

#### UI Components (`src/components/ui/`)
```typescript
// Button.tsx - Reusable button component
// Input.tsx - Form input with validation
// Table.tsx - Data table with pagination
// Modal.tsx - Modal dialog component
// Loading.tsx - Loading spinner
```

#### Layout Components (`src/components/layout/`)
```typescript
// Layout.tsx - Main layout wrapper
// Sidebar.tsx - Navigation sidebar
// Header.tsx - Top header bar
```

#### Pages (`src/pages/`)
```typescript
// Dashboard.tsx - Main dashboard
// Agents.tsx - Agent management
// Events.tsx - Event analysis
// Alerts.tsx - Alert management
// Threats.tsx - Threat intelligence
// DetectionRules.tsx - Detection rules
// Settings.tsx - System settings
```

### 3. API Service Structure
```typescript
// src/services/api.ts - Main API service (✅ Created)
// src/services/dashboardApi.ts - Dashboard APIs
// src/services/agentsApi.ts - Agent APIs
// src/services/eventsApi.ts - Event APIs
// src/services/alertsApi.ts - Alert APIs
// src/services/threatsApi.ts - Threat APIs
// src/services/rulesApi.ts - Rules APIs
```

### 4. State Management
```typescript
// src/store/index.ts - Main store (✅ Created)
// src/store/dashboardStore.ts - Dashboard state
// src/store/agentsStore.ts - Agents state
// src/store/eventsStore.ts - Events state
// src/store/alertsStore.ts - Alerts state
// src/store/threatsStore.ts - Threats state
// src/store/rulesStore.ts - Rules state
```

## 🔧 Development Workflow

### 1. Component Development
```bash
# Create a new component
touch src/components/ui/Button.tsx
touch src/components/ui/Button.test.tsx
```

### 2. Page Development
```bash
# Create a new page
touch src/pages/Dashboard.tsx
```

### 3. API Integration
```bash
# Create API service
touch src/services/dashboardApi.ts
```

### 4. State Management
```bash
# Create store slice
touch src/store/dashboardStore.ts
```

## 📊 Database Schema Integration

The frontend is designed to work with your EDR database schema:

### Tables Mapped
- **Agents**: Endpoint management
- **Events**: Security event storage
- **Alerts**: Security alerts
- **Threats**: Threat intelligence
- **DetectionRules**: Detection engine rules
- **SystemConfig**: System configuration

### Key Relationships
- Agents → Events (1:many)
- Agents → Alerts (1:many)
- Events → Alerts (1:1)
- Threats → Alerts (1:many)
- Rules → Alerts (1:many)

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-50: #eff6ff;
--primary-500: #3b82f6;
--primary-900: #1e3a8a;

/* Security Colors */
--success-500: #22c55e;
--warning-500: #f59e0b;
--danger-500: #ef4444;
--critical-500: #ec4899;

/* Status Colors */
--threat-none: #6b7280;
--threat-suspicious: #f59e0b;
--threat-malicious: #ef4444;
```

### Component Variants
```typescript
// Button variants
variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline'
size: 'sm' | 'md' | 'lg'

// Status badge variants
status: 'Active' | 'Inactive' | 'Error' | 'Open' | 'Resolved' | 'Critical'
variant: 'default' | 'outline' | 'ghost'
```

## 🔄 Real-time Features

### WebSocket Integration
```typescript
// Real-time event updates
// Live alert notifications
// System health monitoring
// Agent status updates
```

### Polling Fallback
```typescript
// Automatic polling for data updates
// Configurable intervals
// Error handling and retry logic
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile Optimizations
- Touch-friendly interactions
- Simplified navigation
- Optimized table layouts
- Responsive charts

## 🚀 Performance Tips

### 1. Code Splitting
```typescript
// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Agents = lazy(() => import('./pages/Agents'));
```

### 2. Virtual Scrolling
```typescript
// For large data tables
import { FixedSizeList as List } from 'react-window';
```

### 3. Optimistic Updates
```typescript
// Immediate UI feedback
const mutation = useMutation({
  mutationFn: updateAlert,
  onMutate: async (newAlert) => {
    // Optimistic update
  },
});
```

## 🔒 Security Considerations

### 1. Input Validation
```typescript
// Zod schemas for form validation
const alertSchema = z.object({
  title: z.string().min(1),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
});
```

### 2. API Security
```typescript
// Request interceptors
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. XSS Protection
```typescript
// Sanitize user input
import DOMPurify from 'dompurify';
const sanitizedHtml = DOMPurify.sanitize(userInput);
```

## 📈 Monitoring & Analytics

### 1. Error Tracking
```typescript
// Error boundaries
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
  }
}
```

### 2. Performance Monitoring
```typescript
// React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
```

## 🎯 Testing Strategy

### 1. Unit Tests
```bash
# Test components
npm run test:unit

# Test utilities
npm run test:utils
```

### 2. Integration Tests
```bash
# Test API integration
npm run test:integration
```

### 3. E2E Tests
```bash
# Test user workflows
npm run test:e2e
```

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)

### Tools
- [Vite](https://vitejs.dev/) - Build tool
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Recharts](https://recharts.org/) - Chart library

## 🆘 Troubleshooting

### Common Issues

#### 1. TypeScript Errors
```bash
# Install missing types
npm install --save-dev @types/react @types/react-dom
```

#### 2. Tailwind Not Working
```bash
# Rebuild CSS
npm run build:css
```

#### 3. API Connection Issues
```bash
# Check backend server
curl http://localhost:5000/health
```

#### 4. Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎉 Success Checklist

- [ ] Development server running on http://localhost:3000
- [ ] Backend API accessible at http://localhost:5000
- [ ] TypeScript compilation successful
- [ ] Tailwind CSS styles loading
- [ ] React Query DevTools visible
- [ ] No console errors
- [ ] Responsive design working
- [ ] Dark mode toggle functional

## 🚀 Ready to Build!

You now have a solid foundation for your EDR dashboard. Start building components and pages based on the structure provided. The API service is ready to connect to your backend, and the state management is set up for efficient data handling.

Happy coding! 🎯 