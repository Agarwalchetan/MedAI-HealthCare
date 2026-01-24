# 🩺 MedAI - AI-Powered Healthcare Platform

<div align="center">

![MedAI Logo](https://img.shields.io/badge/MedAI-Healthcare-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)

**Revolutionizing healthcare through intelligent technology**

[Features](#-key-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

MedAI is a comprehensive, enterprise-grade healthcare platform designed to bridge the healthcare gap in India by connecting patients, doctors, laboratories, and administrators in one unified ecosystem. Built with the MERN stack and powered by cutting-edge AI technology, MedAI makes healthcare accessible, understandable, and intelligent for everyone.

### 💡 The Problem

- **70%** of India's population lives in rural areas, but most healthcare facilities are in cities
- Long distances for basic consultations and diagnostic delays
- Difficulty understanding medical reports and prescriptions
- Rising chronic diseases and persistent infectious diseases
- Lack of centralized, accessible healthcare information systems

### ✨ The Solution

MedAI provides instant, reliable, and affordable preliminary healthcare support through:
- **AI-powered diagnosis** in 22+ Indian languages
- **Secure Health Vault** with intelligent document analysis
- **Real-time location services** for nearby medical facilities
- **Comprehensive medicine database** with alternatives and pricing
- **Multi-role portals** for seamless healthcare management

---

## 🚀 Key Features

### 👤 For Patients

- **AI Health Chatbot**: Multilingual symptom analysis with voice support (22+ Indian languages)
- **Health Vault**: Secure document storage with AI-powered OCR and analysis
- **Smart Medicine Tracking**: Active medication reminders and schedules
- **Medical Records**: Centralized history, prescriptions, and lab reports
- **Paramedic Finder**: Real-time location-based hospital and pharmacy search
- **Appointment Management**: Easy booking and tracking with doctors

### 👨‍⚕️ For Doctors

- **Patient Management**: Comprehensive patient records and history
- **AI Diagnosis Support**: AI-assisted preliminary diagnosis tools
- **Digital Prescriptions**: Create and manage prescriptions digitally
- **Appointment Scheduling**: Manage availability and appointments
- **Earnings Dashboard**: Track consultations and revenue
- **Analytics**: Patient insights and treatment trends

### 🔬 For Laboratories

- **Test Request Management**: Handle lab test requests efficiently
- **Digital Reports**: Upload and manage lab reports with structured data
- **Quality Control**: Track metrics and maintain standards
- **Sample Tracking**: Monitor sample collection and processing
- **Equipment Management**: Maintain equipment and calibration records

### 🛡️ For Administrators

- **User Management**: Oversee all platform users and activities
- **Doctor Approval Workflow**: Verify and approve healthcare providers
- **Medicine Database**: Manage comprehensive medicine information
- **Analytics Dashboard**: System-wide insights and metrics
- **Audit Logging**: Complete activity tracking for compliance
- **Notification System**: Manage platform-wide communications

---

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Smooth animations

#### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing

#### AI & Services
- **Google Gemini AI** - Chat responses & OCR
- **Deepgram** - Speech-to-text & text-to-speech
- **Sarvam AI** - Multi-language translation
- **Google Maps API** - Location services
- **Cloudinary** - File storage & CDN

#### Security & Validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Joi** - Backend validation
- **Yup** - Frontend validation

### MVC Architecture

```
📦 MedAI Platform
├── 🎨 Frontend (React + TypeScript)
│   ├── /src/modules          # Feature modules
│   │   ├── /user             # Patient portal
│   │   ├── /doctor           # Doctor portal
│   │   ├── /lab              # Laboratory portal
│   │   └── /admin            # Admin portal
│   ├── /src/shared           # Shared components & utilities
│   └── /src/pages            # Public pages
│
└── ⚙️ Backend (Node.js + Express)
    ├── /config               # Configuration
    ├── /middlewares          # Auth, validation, error handling
    ├── /modules              # Feature modules
    │   ├── /user             # User management
    │   ├── /doctor           # Doctor management
    │   ├── /lab              # Lab management
    │   ├── /admin            # Admin management
    │   └── /ai               # AI services
    └── /utils                # Helpers & utilities
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 18 or higher
- **MongoDB** 6 or higher
- **Git**
- **Google Gemini API Key** (for AI features)
- **Google Maps API Key** (for location services)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Agarwalchetan/MedAI-HealthCare.git
cd MedAI-HealthCare
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
```

Required environment variables:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/medai

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars

# Server
PORT=5000
FRONTEND_URL=http://localhost:5173

# AI Services
VITE_GEMINI_API_KEY=your-gemini-api-key
DEEPGRAM_API_KEY=your-deepgram-api-key
SARVAM_API_KEY=your-sarvam-api-key

# Maps
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

4. **Start MongoDB**
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

5. **Run the application**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # Frontend only (port 5173)
npm run dev:backend   # Backend only (port 5000)
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 📚 Documentation

Comprehensive documentation is available in the `__Docs__` directory:

- **[API Documentation](/__Docs__/API_DOCUMENTATION.md)** - Complete API reference
- **[Deployment Guide](/__Docs__/DEPLOYMENT.md)** - Production deployment instructions
- **[Contributing Guide](/__Docs__/CONTRIBUTING.md)** - How to contribute
- **[Security Guide](/__Docs__/SECURITY.md)** - Security best practices
- **[Gemini API Setup](/__Docs__/GEMINI_API_SETUP.md)** - AI features configuration
- **[Google Maps Setup](/__Docs__/GOOGLE_MAPS_SETUP.md)** - Location services setup

Additional resources:
- [Requirements Document](/requirements.md) - Detailed requirements
- [Design Document](/design.md) - Architecture and design decisions
- [Routes Overview](/backend/ROUTES_OVERVIEW.txt) - API endpoints reference

---

## 🎯 Current Status

### Phase 1 (MVP) - ✅ Completed

- ✅ User/Patient Portal (Fully functional)
- ✅ AI Health Chatbot with multilingual support
- ✅ Health Vault with OCR and document analysis
- ✅ Medical records management
- ✅ Location-based paramedic finder
- ✅ Medicine tracking and search
- ✅ Doctor registration and approval workflow
- ✅ Lab management system
- ✅ Admin dashboard and controls

### Phase 2 - 🚧 Planned

- 🔄 Telemedicine video consultations
- 🔄 Payment gateway integration
- 🔄 Insurance claim processing
- 🔄 Wearable device integration
- 🔄 Mobile applications (iOS/Android)
- 🔄 ABDM integration
- 🔄 Advanced analytics and reporting

---

## 🔒 Security Features

- **Password Hashing**: Bcrypt with 12 salt rounds
- **JWT Authentication**: HttpOnly cookies with 7-day expiration
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi (backend) and Yup (frontend)
- **Security Headers**: Helmet.js implementation
- **CORS Protection**: Whitelist-based origin control
- **SQL Injection Prevention**: Mongoose query sanitization
- **XSS Protection**: Input sanitization and output encoding

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](/__Docs__/CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📊 Project Stats

- **Lines of Code**: 50,000+
- **API Endpoints**: 40+
- **Supported Languages**: 22+ Indian languages
- **Database Collections**: 9
- **AI Models Integrated**: 3
- **Security Middleware**: 5+

---

## 🌍 Roadmap

### Short Term (3-6 months)
- Mobile app development
- Enhanced AI diagnosis models
- Telemedicine integration
- Payment processing

### Medium Term (6-12 months)
- ABDM compliance
- Insurance integration
- Wearable device support
- Advanced analytics

### Long Term (12+ months)
- International expansion
- AI avatars for consultations
- Predictive health models
- Hospital management system

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ by the MedAI Team

---

## 📞 Support

- **Documentation**: Check the `__Docs__` directory
- **Issues**: [GitHub Issues](https://github.com/Agarwalchetan/MedAI-HealthCare/issues)
- **Email**: support@medai.com

---

## 🙏 Acknowledgments

- Google Gemini AI for intelligent document analysis
- Deepgram for speech services
- Sarvam AI for translation services
- All open-source contributors

---

<div align="center">

**MedAI - Making healthcare accessible, understandable, and intelligent for everyone**

⭐ Star us on GitHub — it helps!

[Website](https://medai.com) • [Documentation](/__Docs__) • [Report Bug](https://github.com/Agarwalchetan/MedAI-HealthCare) • [Request Feature](https://github.com/Agarwalchetan/MedAI-HealthCare/issues)

</div>
