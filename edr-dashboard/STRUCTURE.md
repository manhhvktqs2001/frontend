# EDR Dashboard Frontend Structure

## 📁 Complete File Structure

```
frontend/edr-dashboard/
├── public/
│   ├── vite.svg
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── StatusBadge.tsx          # Status indicators
│   │   │   ├── Button.tsx               # Reusable button component
│   │   │   ├── Input.tsx                # Form input component
│   │   │   ├── Table.tsx                # Data table component
│   │   │   ├── Modal.tsx                # Modal dialog component
│   │   │   ├── Dropdown.tsx             # Dropdown menu component
│   │   │   ├── Badge.tsx                # Badge component
│   │   │   ├── Card.tsx                 # Card container component
│   │   │   ├── Loading.tsx              # Loading spinner component
│   │   │   └── index.ts                 # UI components export
│   │   ├── layout/
│   │   │   ├── Layout.tsx               # Main layout wrapper
│   │   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   │   ├── Header.tsx               # Top header bar
│   │   │   ├── Footer.tsx               # Footer component
│   │   │   └── Breadcrumb.tsx           # Breadcrumb navigation
│   │   ├── charts/
│   │   │   ├── EventTimeline.tsx        # Event timeline chart
│   │   │   ├── AgentStatusChart.tsx     # Agent status distribution
│   │   │   ├── AlertSeverityChart.tsx   # Alert severity breakdown
│   │   │   ├── SystemHealthChart.tsx    # System health metrics
│   │   │   ├── ThreatTypeChart.tsx      # Threat type distribution
│   │   │   └── PerformanceChart.tsx     # Performance metrics
│   │   ├── forms/
│   │   │   ├── CreateRuleForm.tsx       # Detection rule creation
│   │   │   ├── CreateThreatForm.tsx     # Threat indicator creation
│   │   │   ├── AgentConfigForm.tsx      # Agent configuration
│   │   │   ├── AlertFilterForm.tsx      # Alert filtering
│   │   │   ├── EventFilterForm.tsx      # Event filtering
│   │   │   └── SystemConfigForm.tsx     # System configuration
│   │   └── dashboard/
│   │       ├── StatsCards.tsx           # Dashboard statistics cards
│   │       ├── RecentAlerts.tsx         # Recent alerts widget
│   │       ├── AgentOverview.tsx        # Agent overview widget
│   │       ├── EventSummary.tsx         # Event summary widget
│   │       ├── ThreatOverview.tsx       # Threat overview widget
│   │       └── SystemStatus.tsx         # System status widget
│   ├── pages/
│   │   ├── Dashboard.tsx                # Main dashboard page
│   │   ├── Agents.tsx                   # Agent management page
│   │   ├── Events.tsx                   # Event analysis page
│   │   ├── Alerts.tsx                   # Alert management page
│   │   ├── Threats.tsx                  # Threat intelligence page
│   │   ├── DetectionRules.tsx           # Detection rules page
│   │   ├── Settings.tsx                 # System settings page
│   │   ├── AgentDetail.tsx              # Individual agent detail
│   │   ├── EventDetail.tsx              # Individual event detail
│   │   ├── AlertDetail.tsx              # Individual alert detail
│   │   └── NotFound.tsx                 # 404 error page
│   ├── hooks/
│   │   ├── useApi.ts                    # API data fetching hooks
│   │   ├── useRealtime.ts               # Real-time data hooks
│   │   ├── useFilters.ts                # Filter management hooks
│   │   ├── usePagination.ts             # Pagination hooks
│   │   ├── useExport.ts                 # Data export hooks
│   │   ├── useNotifications.ts          # Notification hooks
│   │   └── useTheme.ts                  # Theme management hooks
│   ├── services/
│   │   ├── api.ts                       # Main API service
│   │   ├── dashboardApi.ts              # Dashboard-specific APIs
│   │   ├── agentsApi.ts                 # Agent management APIs
│   │   ├── eventsApi.ts                 # Event management APIs
│   │   ├── alertsApi.ts                 # Alert management APIs
│   │   ├── threatsApi.ts                # Threat intelligence APIs
│   │   ├── rulesApi.ts                  # Detection rules APIs
│   │   ├── configApi.ts                 # Configuration APIs
│   │   └── websocket.ts                 # WebSocket service
│   ├── store/
│   │   ├── index.ts                     # Main Zustand store
│   │   ├── dashboardStore.ts            # Dashboard state
│   │   ├── agentsStore.ts               # Agents state
│   │   ├── eventsStore.ts               # Events state
│   │   ├── alertsStore.ts               # Alerts state
│   │   ├── threatsStore.ts              # Threats state
│   │   ├── rulesStore.ts                # Rules state
│   │   └── uiStore.ts                   # UI state
│   ├── types/
│   │   ├── index.ts                     # Main type definitions
│   │   ├── api.ts                       # API response types
│   │   ├── dashboard.ts                 # Dashboard types
│   │   ├── agents.ts                    # Agent types
│   │   ├── events.ts                    # Event types
│   │   ├── alerts.ts                    # Alert types
│   │   ├── threats.ts                   # Threat types
│   │   ├── rules.ts                     # Detection rule types
│   │   └── ui.ts                        # UI component types
│   ├── utils/
│   │   ├── cn.ts                        # Class name utility
│   │   ├── date.ts                      # Date formatting utilities
│   │   ├── format.ts                    # Data formatting utilities
│   │   ├── validation.ts                # Form validation utilities
│   │   ├── export.ts                    # Export utilities
│   │   ├── constants.ts                 # Application constants
│   │   └── helpers.ts                   # General helper functions
│   ├── styles/
│   │   ├── globals.css                  # Global styles
│   │   ├── components.css               # Component-specific styles
│   │   └── themes.css                   # Theme-specific styles
│   ├── App.tsx                          # Main application component
│   ├── main.tsx                         # Application entry point
│   └── index.css                        # Main CSS file
├── package.json                         # Dependencies and scripts
├── package-lock.json                    # Locked dependencies
├── tsconfig.json                        # TypeScript configuration
├── tsconfig.node.json                   # Node TypeScript config
├── vite.config.ts                       # Vite build configuration
├── tailwind.config.js                   # Tailwind CSS configuration
├── postcss.config.js                    # PostCSS configuration
├── .env.example                         # Environment variables example
├── .gitignore                           # Git ignore rules
├── README.md                            # Project documentation
├── STRUCTURE.md                         # This file
└── index.html                           # HTML template
```

## 🎯 Component Architecture

### UI Components (`src/components/ui/`)
Base reusable components that follow a consistent design system:

- **StatusBadge**: Displays status indicators with colors and icons
- **Button**: Standardized button component with variants
- **Input**: Form input with validation states
- **Table**: Data table with sorting and pagination
- **Modal**: Modal dialog for forms and confirmations
- **Dropdown**: Dropdown menu component
- **Badge**: Small status indicators
- **Card**: Container component for content sections
- **Loading**: Loading spinner and skeleton components

### Layout Components (`src/components/layout/`)
Structure and navigation components:

- **Layout**: Main application wrapper
- **Sidebar**: Navigation sidebar with menu items
- **Header**: Top header with user info and actions
- **Footer**: Application footer
- **Breadcrumb**: Navigation breadcrumbs

### Chart Components (`src/components/charts/`)
Data visualization components using Recharts:

- **EventTimeline**: Real-time event timeline chart
- **AgentStatusChart**: Agent status distribution pie chart
- **AlertSeverityChart**: Alert severity breakdown
- **SystemHealthChart**: System health metrics
- **ThreatTypeChart**: Threat type distribution
- **PerformanceChart**: Performance metrics over time

### Form Components (`src/components/forms/`)
Form components for data entry:

- **CreateRuleForm**: Detection rule creation form
- **CreateThreatForm**: Threat indicator creation form
- **AgentConfigForm**: Agent configuration form
- **AlertFilterForm**: Alert filtering form
- **EventFilterForm**: Event filtering form
- **SystemConfigForm**: System configuration form

### Dashboard Components (`src/components/dashboard/`)
Dashboard-specific widgets:

- **StatsCards**: Key metrics cards
- **RecentAlerts**: Recent alerts widget
- **AgentOverview**: Agent overview widget
- **EventSummary**: Event summary widget
- **ThreatOverview**: Threat overview widget
- **SystemStatus**: System status widget

## 📄 Page Structure

### Main Pages
- **Dashboard**: Overview with key metrics and widgets
- **Agents**: Agent management and monitoring
- **Events**: Event analysis and filtering
- **Alerts**: Alert management and triage
- **Threats**: Threat intelligence management
- **DetectionRules**: Detection rule configuration
- **Settings**: System configuration

### Detail Pages
- **AgentDetail**: Individual agent details and history
- **EventDetail**: Individual event analysis
- **AlertDetail**: Individual alert investigation

## 🔧 State Management

### Zustand Stores
- **Main Store**: Global application state
- **Dashboard Store**: Dashboard-specific state
- **Agents Store**: Agent management state
- **Events Store**: Event analysis state
- **Alerts Store**: Alert management state
- **Threats Store**: Threat intelligence state
- **Rules Store**: Detection rules state
- **UI Store**: UI state (sidebar, theme, etc.)

## 🌐 API Integration

### Service Layer
- **Main API**: Core API service with interceptors
- **Dashboard API**: Dashboard-specific endpoints
- **Agents API**: Agent management endpoints
- **Events API**: Event management endpoints
- **Alerts API**: Alert management endpoints
- **Threats API**: Threat intelligence endpoints
- **Rules API**: Detection rules endpoints
- **Config API**: Configuration endpoints
- **WebSocket**: Real-time data service

## 🎨 Styling Architecture

### Tailwind CSS
- Custom color palette for security themes
- Component-specific utility classes
- Responsive design utilities
- Dark mode support

### Custom Components
- Consistent design system
- Reusable component patterns
- Accessibility features
- Performance optimizations

## 🔄 Data Flow

1. **API Calls**: Services make HTTP requests to backend
2. **State Updates**: Zustand stores manage application state
3. **UI Updates**: React components re-render based on state
4. **Real-time**: WebSocket provides live updates
5. **Caching**: React Query handles data caching and synchronization

## 🚀 Performance Features

- **Code Splitting**: Lazy loading of routes and components
- **Virtual Scrolling**: For large data tables
- **Optimistic Updates**: Immediate UI feedback
- **Caching**: Intelligent data caching with React Query
- **Bundle Optimization**: Tree shaking and minification

## 🔒 Security Features

- **API Authentication**: Token-based authentication
- **Input Validation**: Form validation with Zod
- **XSS Protection**: Sanitized data rendering
- **CSRF Protection**: API request protection
- **Error Boundaries**: Graceful error handling

## 📱 Responsive Design

- **Mobile First**: Responsive design approach
- **Breakpoints**: Tailwind responsive utilities
- **Touch Friendly**: Mobile-optimized interactions
- **Progressive Enhancement**: Works without JavaScript

## 🌙 Theme Support

- **Light/Dark Mode**: Built-in theme switching
- **System Preference**: Automatic theme detection
- **Persistent**: Theme preference saved locally
- **Consistent**: Unified color scheme across components 