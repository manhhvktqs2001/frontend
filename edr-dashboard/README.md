# EDR Security Platform v3.0.0

🚀 **Advanced Endpoint Detection and Response System** with AI-powered threat intelligence and real-time security monitoring.

![EDR Platform](https://img.shields.io/badge/EDR-Platform%20v3.0.0-blue?style=for-the-badge&logo=shield)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.5-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔒 **Core Security Features**
- **Real-time Threat Detection** - Advanced behavioral analysis and signature-based detection
- **AI-Powered Security Assistant** - Intelligent threat analysis and recommendations
- **Endpoint Management** - Comprehensive agent monitoring and control
- **Incident Response** - Automated and manual response workflows
- **Threat Intelligence** - Global threat feeds and intelligence sharing

### 📊 **Analytics & Reporting**
- **Advanced Analytics Dashboard** - Real-time security metrics and trends
- **Custom Reports** - Comprehensive security reporting and compliance
- **Performance Monitoring** - System health and performance tracking
- **Risk Assessment** - Automated risk scoring and prioritization

### 🎨 **Modern UI/UX**
- **Glassmorphism Design** - Modern, professional security interface
- **Responsive Layout** - Optimized for desktop, tablet, and mobile
- **Dark Theme** - Eye-friendly dark mode optimized for security operations
- **Real-time Updates** - Live data streaming and notifications

### 🤖 **AI Integration**
- **Natural Language Queries** - Ask security questions in plain English
- **Automated Threat Analysis** - AI-powered incident investigation
- **Predictive Analytics** - Machine learning-based threat prediction
- **Smart Recommendations** - AI-driven security improvement suggestions

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0.0 or higher
- npm 8.0.0 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/edr-security/platform-v3.git
cd platform-v3
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy
npm run deploy
```

## 📁 Project Structure

```
frontend/edr-dashboard/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Header, Sidebar, Layout)
│   │   └── ui/              # Reusable UI components
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── Agents.jsx       # Endpoint management
│   │   ├── Alerts.jsx       # Security alerts
│   │   ├── Threats.jsx      # Threat intelligence
│   │   ├── Events.jsx       # System events
│   │   ├── Analytics.jsx    # Advanced analytics
│   │   ├── AI.jsx          # AI assistant
│   │   ├── Reports.jsx      # Security reports
│   │   └── Settings.jsx     # System settings
│   ├── services/            # API services
│   ├── utils/               # Utility functions
│   ├── App.jsx             # Main app component
│   └── main.jsx            # App entry point
├── public/                  # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🎯 Key Components

### Dashboard
- Real-time security overview
- Threat statistics and trends
- System health monitoring
- Quick action buttons

### AI Assistant
- Natural language security queries
- Automated threat analysis
- Security recommendations
- Voice input support

### Analytics
- Advanced threat visualization
- Behavioral analysis charts
- MITRE ATT&CK coverage
- Risk assessment matrix

### Agents Management
- Endpoint monitoring
- Agent status tracking
- Remote management
- Performance metrics

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_VERSION=3.0.0
VITE_ENVIRONMENT=development
```

### Tailwind Configuration
The project uses Tailwind CSS with custom configurations for the security theme. See `tailwind.config.js` for details.

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Trust and security
- **Secondary**: Purple (#8b5cf6) - Innovation and AI
- **Success**: Green (#10b981) - Safe and operational
- **Warning**: Orange (#f59e0b) - Caution and attention
- **Error**: Red (#ef4444) - Critical threats and alerts

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: JetBrains Mono for technical content

### Components
- **Cards**: Glassmorphism effect with backdrop blur
- **Buttons**: Gradient backgrounds with hover effects
- **Tables**: Modern design with hover states
- **Forms**: Clean inputs with focus states

## 🔌 API Integration

The platform integrates with the EDR backend API for real-time data:

```javascript
// Example API usage
import { api } from './services/api';

// Get dashboard statistics
const stats = await api.getDashboardStats();

// Get active agents
const agents = await api.getAgents();

// Get security alerts
const alerts = await api.getAlerts();
```

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t edr-platform:v3.0.0 .

# Run container
docker run -p 3000:3000 edr-platform:v3.0.0
```

### Cloud Deployment
The platform is optimized for deployment on:
- **AWS** - S3 + CloudFront
- **Azure** - Static Web Apps
- **Google Cloud** - Cloud Storage
- **Vercel** - Zero-config deployment
- **Netlify** - Git-based deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for type safety
- Write comprehensive tests
- Follow the established design system
- Document new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.edr-platform.com](https://docs.edr-platform.com)
- **Issues**: [GitHub Issues](https://github.com/edr-security/platform-v3/issues)
- **Discussions**: [GitHub Discussions](https://github.com/edr-security/platform-v3/discussions)
- **Email**: support@edr-platform.com

## 🔄 Changelog

### v3.0.0 (2024-01-15)
- ✨ Complete UI/UX redesign with glassmorphism
- 🤖 New AI Security Assistant
- 📊 Enhanced analytics dashboard
- 🎨 Modern design system
- 📱 Improved mobile responsiveness
- ⚡ Performance optimizations
- 🔒 Enhanced security features

### v2.1.0 (2023-12-01)
- Bug fixes and performance improvements
- Enhanced threat detection algorithms
- Improved user experience

### v2.0.0 (2023-11-01)
- Major feature release
- New dashboard design
- Advanced analytics

---

**Built with ❤️ by the EDR Security Team**

[![Security Platform](https://img.shields.io/badge/Security-Platform-blue?style=for-the-badge&logo=shield)](https://edr-platform.com) 