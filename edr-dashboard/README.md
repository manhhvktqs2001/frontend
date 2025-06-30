# EDR Security Dashboard

A modern, real-time security dashboard for Endpoint Detection and Response (EDR) systems built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Real-time Monitoring**: Live updates of security events, alerts, and system health
- **Agent Management**: Monitor and manage endpoint agents across your network
- **Event Analysis**: Comprehensive event logging and analysis with filtering
- **Alert Management**: Security alert triage, investigation, and resolution workflows
- **Threat Intelligence**: Manage threat indicators and detection rules
- **Detection Engine**: Configure and manage behavioral and signature-based detection rules
- **System Configuration**: Centralized system and agent configuration management
- **Responsive Design**: Modern, responsive UI that works on desktop and mobile
- **Dark Mode**: Built-in dark/light theme support
- **Real-time Charts**: Interactive charts and visualizations using Recharts
- **Export Capabilities**: Export data in CSV and JSON formats

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router DOM
- **State Management**: Zustand with Immer
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS with custom components
- **Charts**: Recharts
- **Icons**: Lucide React & Heroicons
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **Build Tool**: Vite
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- EDR Backend Server running on `http://localhost:5000`

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend/edr-dashboard
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_TITLE=EDR Security Dashboard
VITE_APP_VERSION=2.0.0
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── layout/         # Layout components (sidebar, header, etc.)
│   ├── charts/         # Chart components
│   └── forms/          # Form components
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Agents.tsx      # Agent management
│   ├── Events.tsx      # Event analysis
│   ├── Alerts.tsx      # Alert management
│   ├── Threats.tsx     # Threat intelligence
│   ├── DetectionRules.tsx # Detection rules
│   └── Settings.tsx    # System settings
├── hooks/              # Custom React hooks
├── services/           # API services
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── styles/             # Global styles
```

## 🎨 UI Components

### Status Badges
- Agent status indicators (Active, Inactive, Error, etc.)
- Alert severity levels (Low, Medium, High, Critical)
- Event threat levels (None, Suspicious, Malicious)

### Charts
- Real-time event timeline
- Agent status distribution
- Alert severity breakdown
- System health metrics

### Tables
- Sortable and filterable data tables
- Pagination support
- Export functionality
- Real-time updates

## 🔌 API Integration

The dashboard integrates with the EDR backend API endpoints:

- **Dashboard**: `/api/v1/dashboard/*`
- **Agents**: `/api/v1/agents/*`
- **Events**: `/api/v1/events/*`
- **Alerts**: `/api/v1/alerts/*`
- **Threats**: `/api/v1/threats/*`
- **Detection Rules**: `/api/v1/detection/*`
- **System Config**: `/api/v1/system/*`

## 🎯 Key Features

### Dashboard Overview
- System health score and status
- Real-time agent statistics
- Event processing metrics
- Alert summary and trends
- Threat intelligence overview

### Agent Management
- Agent registration and monitoring
- Performance metrics (CPU, Memory, Disk)
- Network connectivity status
- Agent configuration management
- Event and alert history per agent

### Event Analysis
- Comprehensive event logging
- Advanced filtering and search
- Event correlation analysis
- Threat level assessment
- Export capabilities

### Alert Management
- Alert triage and investigation
- Assignment and resolution workflows
- Severity-based prioritization
- False positive management
- Alert correlation

### Threat Intelligence
- Threat indicator management
- MITRE ATT&CK framework integration
- Threat source tracking
- Confidence scoring
- Bulk import/export

### Detection Rules
- Behavioral detection rules
- Signature-based detection
- Threshold monitoring
- Rule testing and validation
- MITRE ATT&CK mapping

## 🔧 Configuration

### System Settings
- Database connection monitoring
- Feature enable/disable toggles
- Performance tuning parameters
- Alert retention policies
- Agent heartbeat intervals

### Agent Configuration
- Monitoring scope configuration
- Event collection settings
- Performance thresholds
- Network access controls
- Update management

## 📊 Data Visualization

### Real-time Charts
- Event timeline with granularity options
- Agent status distribution pie charts
- Alert severity breakdown
- System performance metrics
- Threat detection trends

### Interactive Dashboards
- Customizable widget layouts
- Real-time data updates
- Drill-down capabilities
- Export and sharing features

## 🔒 Security Features

- Network access validation
- API authentication
- Session management
- Audit logging
- Role-based access control (future)

## 🚀 Performance Optimization

- React Query for efficient data fetching
- Zustand for lightweight state management
- Virtual scrolling for large datasets
- Lazy loading of components
- Optimized bundle splitting

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks (future)

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- Desktop (1920x1080+)
- Tablet (768px+)
- Mobile (320px+)

## 🌙 Dark Mode

Built-in dark mode support with:
- System preference detection
- Manual toggle
- Persistent theme selection
- Consistent color scheme

## 🔄 Real-time Updates

- WebSocket integration for live data
- Polling fallback for compatibility
- Optimistic UI updates
- Conflict resolution

## 📈 Monitoring & Analytics

- Performance metrics tracking
- User interaction analytics
- Error monitoring and reporting
- Usage statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

## 🔮 Roadmap

- [ ] Advanced user management
- [ ] Role-based access control
- [ ] Custom dashboard widgets
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Advanced analytics
- [ ] Machine learning integration
