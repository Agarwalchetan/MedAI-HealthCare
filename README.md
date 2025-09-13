# 🩺 MedAI - Enterprise Healthcare Platform

A comprehensive, modular healthcare platform built with the MERN stack, featuring AI-powered diagnosis, multi-role management, and enterprise-grade security.

## 🚀 Project Overview

MedAI is designed as a scalable healthcare ecosystem connecting patients, doctors, laboratories, insurance providers, and administrators in one unified platform. Built with strict MVC architecture patterns and enterprise-grade security standards.

### 🎯 Current Status: Phase 1 (MVP)
- ✅ **Patient Portal**: Fully functional with complete CRUD operations
- 🔒 **Other Modules**: Placeholder structure ready for future development

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + TailwindCSS + Vite
- **Backend**: Node.js + Express.js + MongoDB + Mongoose
- **Authentication**: JWT with HttpOnly cookies
- **Validation**: Joi (backend) + Yup (frontend)
- **Security**: Helmet, CORS, Rate Limiting, Bcrypt

### MVC Pattern Implementation
```
📁 Backend Structure
├── /config          # Database & environment configuration
├── /middlewares      # Authentication, validation, error handling
├── /modules          # Feature modules (User, Doctor, Lab, etc.)
│   └── /user         # FULLY IMPLEMENTED
│       ├── /controllers
│       ├── /models
│       ├── /services
│       └── /routes
└── /utils           # Logging, response helpers

📁 Frontend Structure
├── /src/modules     # Feature modules
│   └── /user        # FULLY IMPLEMENTED
│       ├── /pages
│       ├── /components
│       └── /services
├── /shared          # Shared components, hooks, types
└── /pages           # Public pages
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- Git

### Installation

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd medai-healthcare-platform
npm install
```

2. **Environment Configuration**
```bash
# Copy the .env file and update with your values
cp .env.example .env

# Required environment variables:
MONGODB_URI=mongodb://localhost:27017/medai
JWT_SECRET=your-super-secure-jwt-secret-key
PORT=5000
FRONTEND_URL=http://localhost:5173
```

3. **Database Setup**
```bash
# Start MongoDB service
sudo systemctl start mongod

# The application will automatically create the database and collections
```

4. **Start Development Servers**
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
npm run dev:frontend  # Frontend only (port 5173)
npm run dev:backend   # Backend only (port 5000)
```

## 🎯 Features (Phase 1)

### ✅ Patient Portal (Fully Functional)
- **Authentication**: Secure registration/login with JWT
- **Profile Management**: Complete CRUD for patient information
- **AI Chatbot**: Preliminary health diagnosis and guidance
- **Medical History**: Add, view, and manage medical records
- **Prescriptions**: View and track medications
- **Lab Reports**: Upload and manage test results
- **Insurance**: Manage insurance details and coverage
- **Paramedics**: Find nearby medical stores and emergency services
- **Medicine Database**: Search and learn about medications

### 🔒 Coming Soon Modules
- **Doctor Portal** (Phase 2): Patient management, appointments, telemedicine
- **Lab Management** (Phase 3): Test management, result processing
- **Insurance Integration** (Phase 4): Claims processing, coverage verification
- **Admin Panel** (Phase 5): System administration, analytics
- **Manager Tools** (Phase 6): Facility management, staff coordination

## 🔐 Security Features

- **Authentication**: JWT tokens with HttpOnly cookies
- **Password Security**: Bcrypt hashing with salt rounds
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Secure cross-origin resource sharing
- **Helmet Integration**: Security headers and protection
- **Error Handling**: Comprehensive error management without data leakage

## 📱 User Experience

### Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Tablet Support**: Enhanced layouts for tablet screens
- **Desktop**: Full-featured desktop experience

### Design System
- **Color Palette**: Medical blues, greens, and professional grays
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent 8px spacing system
- **Animations**: Subtle micro-interactions and hover states

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with validation
- [ ] User login/logout functionality
- [ ] Profile management (view/edit)
- [ ] Medical history CRUD operations
- [ ] AI chatbot interactions
- [ ] Responsive design across devices
- [ ] Error handling and validation messages

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production backend
npm run start:backend
```

### Environment Variables (Production)
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medai
JWT_SECRET=production-secret-key
FRONTEND_URL=https://your-domain.com
```

## 📈 Roadmap

### Phase 2: Doctor Portal (Q2 2025)
- ✅ Doctor registration and verification
- ✅ Appointment scheduling system
- ✅ Patient consultation tools
- ✅ Digital prescription management
- ✅ AI diagnosis monitoring

### Phase 3: Lab Integration (Q3 2025)
- ✅ Laboratory information system
- ✅ Digital report management
- ✅ Automated result delivery to health vaults
- ✅ Quality control workflows
- ✅ Doctor-lab integration

### Phase 4: Insurance Claims (Q4 2025)
- Automated claims processing
- Coverage verification
- Policy management
- Payment integration

### Phase 5: Admin & Analytics (Q1 2026)
- System administration dashboard
- User management across all roles
- Platform analytics and reporting
- Security audit tools

### Phase 6: Mobile Applications (Q2 2026)
- Native iOS application
- Native Android application
- Offline functionality
- Push notifications

## 🤝 Contributing

### Development Guidelines
- Follow MVC architecture patterns
- Maintain strict TypeScript typing
- Write comprehensive error handling
- Follow the established folder structure
- Add proper validation for all inputs
- Maintain security best practices

### Code Standards
- ESLint + Prettier configuration
- Consistent naming conventions
- Comprehensive commenting
- Modular, reusable components
- Proper error boundaries

## 📞 Support

For technical support or questions:
- **Email**: support@medai.com
- **Documentation**: [Internal Wiki]
- **Issue Tracking**: [GitHub Issues]

## 📄 License

This project is proprietary software. All rights reserved.

---

**Built with ❤️ by the MedAI Development Team**

*Revolutionizing healthcare through intelligent technology*