# Quick Start Guide

Get MedAI up and running in 10 minutes!

## Prerequisites Check

Before you begin, make sure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **MongoDB 6+** installed ([Download](https://www.mongodb.com/try/download/community))
- ✅ **Git** installed ([Download](https://git-scm.com/downloads))
- ✅ **Code Editor** (VS Code recommended)

### Verify Installation

```bash
# Check Node.js version
node --version
# Should show v18.x.x or higher

# Check npm version
npm --version
# Should show 9.x.x or higher

# Check MongoDB version
mongod --version
# Should show 6.x.x or higher

# Check Git version
git --version
# Should show 2.x.x or higher
```

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Agarwalchetan/MedAI-HealthCare.git

# Navigate to project directory
cd MedAI-HealthCare
```

---

## Step 2: Install Dependencies

```bash
# Install all dependencies (this may take 2-3 minutes)
npm install
```

**What's being installed?**
- Backend dependencies (Express, MongoDB, JWT, etc.)
- Frontend dependencies (React, TypeScript, TailwindCSS, etc.)
- Development tools (ESLint, Nodemon, etc.)

---

## Step 3: Setup Environment Variables

### Option A: Quick Setup (Development)

```bash
# Copy the example environment file
cp .env.example .env
```

### Option B: Manual Setup

Create a `.env` file in the root directory with these variables:

```env
# Database (use default for local development)
MONGODB_URI=mongodb://localhost:27017/medai

# Authentication (generate a random 32+ character string)
JWT_SECRET=your-super-secure-jwt-secret-key-min-32-chars

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# AI Services (Optional for basic testing)
VITE_GEMINI_API_KEY=your-gemini-api-key
DEEPGRAM_API_KEY=your-deepgram-api-key
SARVAM_API_KEY=your-sarvam-api-key

# Maps (Optional for basic testing)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# File Storage (Optional for basic testing)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

**Note**: You can start without API keys. The app will work with limited functionality.

### Generate JWT Secret

```bash
# Generate a secure random string (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 4: Start MongoDB

### Windows

```bash
# Start MongoDB service
net start MongoDB

# Or if installed manually
mongod
```

### macOS

```bash
# Start MongoDB service
brew services start mongodb-community

# Or run manually
mongod --config /usr/local/etc/mongod.conf
```

### Linux

```bash
# Start MongoDB service
sudo systemctl start mongod

# Check status
sudo systemctl status mongod
```

### Verify MongoDB is Running

```bash
# Connect to MongoDB shell
mongosh

# You should see MongoDB shell prompt
# Type 'exit' to quit
```

---

## Step 5: Start the Application

### Option A: Start Both Frontend and Backend

```bash
# Start both servers concurrently
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Option B: Start Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

---

## Step 6: Access the Application

Open your browser and navigate to:

**Frontend**: http://localhost:5173

You should see the MedAI homepage!

---

## Quick Test

### Test 1: Register a User

1. Go to http://localhost:5173
2. Click "Get Started" or "Sign Up"
3. Fill in the registration form:
   - Full Name: Test User
   - Email: test@example.com
   - Password: Test123456
   - Age: 30
   - Gender: Male
   - Phone: 9876543210
4. Click "Register"
5. You should receive a verification code (check console logs)

### Test 2: Check Backend API

```bash
# Test health endpoint
curl http://localhost:5000/health

# Should return:
# {"status":"healthy","timestamp":"..."}
```

### Test 3: Check Database

```bash
# Connect to MongoDB
mongosh

# Switch to medai database
use medai

# Check collections
show collections

# Check users
db.users.find().pretty()

# Exit
exit
```

---

## Common Issues & Solutions

### Issue 1: Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

Or change the port in `.env`:
```env
PORT=5001
```

### Issue 2: MongoDB Connection Failed

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
1. Make sure MongoDB is running
2. Check MongoDB URI in `.env`
3. Try connecting manually: `mongosh`

### Issue 3: Module Not Found

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check `FRONTEND_URL` in `.env` matches your frontend URL
2. Restart backend server

### Issue 5: API Keys Not Working

**Error**: `API key invalid` or `Unauthorized`

**Solution**:
1. Verify API keys are correct in `.env`
2. Check if keys have `VITE_` prefix for frontend keys
3. Restart development server after changing `.env`

---

## Next Steps

### 1. Explore the Application

- **User Portal**: Register and explore patient features
- **Doctor Portal**: Register as a doctor (requires admin approval)
- **Admin Portal**: Use seed admin credentials (see below)

### 2. Seed Admin Account

```bash
# Run the seed script
node backend/modules/admin/utils/seedAdmin.js
```

Default admin credentials:
- Email: admin@medai.com
- Password: Admin@123

**⚠️ Change these credentials in production!**

### 3. Get API Keys (Optional)

For full functionality, get API keys from:

1. **Google Gemini AI**: [Get API Key](https://aistudio.google.com/)
   - Used for: AI chatbot, OCR
   - See: [Gemini API Setup](__Docs__/GEMINI_API_SETUP.md)

2. **Deepgram**: [Get API Key](https://deepgram.com/)
   - Used for: Speech-to-text, text-to-speech
   - Free tier available

3. **Sarvam AI**: [Get API Key](https://www.sarvam.ai/)
   - Used for: Translation
   - Contact for API access

4. **Google Maps**: [Get API Key](https://console.cloud.google.com/)
   - Used for: Location services
   - See: [Google Maps Setup](__Docs__/GOOGLE_MAPS_SETUP.md)

5. **Cloudinary**: [Get Credentials](https://cloudinary.com/)
   - Used for: File storage
   - Free tier available

### 4. Read Documentation

- [API Documentation](__Docs__/API_DOCUMENTATION.md)
- [Database Schema](__Docs__/DATABASE_SCHEMA.md)
- [Security Guide](__Docs__/SECURITY.md)
- [Contributing Guide](__Docs__/CONTRIBUTING.md)

### 5. Start Developing

- Check [CONTRIBUTING.md](__Docs__/CONTRIBUTING.md) for development guidelines
- Review [requirements.md](../requirements.md) for feature requirements
- See [design.md](../design.md) for architecture details

---

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit files in `src/` for frontend
   - Edit files in `backend/` for backend

3. **Test your changes**
   ```bash
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Changes reflect immediately
- **Backend**: Nodemon restarts server automatically

### Debugging

**Frontend (Chrome DevTools)**:
1. Open Chrome DevTools (F12)
2. Go to Sources tab
3. Set breakpoints in your code

**Backend (VS Code)**:
1. Add breakpoint in code
2. Press F5 to start debugging
3. Or use `console.log()` for quick debugging

---

## Useful Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Building
npm run build            # Build frontend for production

# Linting
npm run lint             # Check code style
npm run lint:fix         # Fix code style issues

# Database
mongosh                  # Connect to MongoDB shell
npm run seed:admin       # Seed admin account (if script exists)

# Git
git status               # Check status
git log --oneline        # View commit history
git branch               # List branches
```

---

## Project Structure Overview

```
medai-healthcare-platform/
├── backend/                 # Backend code
│   ├── config/             # Configuration
│   ├── middlewares/        # Middleware functions
│   ├── modules/            # Feature modules
│   │   ├── user/          # User module
│   │   ├── doctor/        # Doctor module
│   │   ├── lab/           # Lab module
│   │   ├── admin/         # Admin module
│   │   └── ai/            # AI services
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
│
├── src/                    # Frontend code
│   ├── modules/           # Feature modules
│   │   ├── user/         # User portal
│   │   ├── doctor/       # Doctor portal
│   │   ├── lab/          # Lab portal
│   │   └── admin/        # Admin portal
│   ├── shared/           # Shared components
│   ├── pages/            # Public pages
│   └── main.tsx          # Entry point
│
├── __Docs__/              # Documentation
├── .env                   # Environment variables
├── package.json           # Dependencies
└── README.md             # Main documentation
```

---

## Getting Help

### Documentation
- Check the `__Docs__/` directory
- Read the [README.md](../README.md)
- Review [API Documentation](__Docs__/API_DOCUMENTATION.md)

### Community
- GitHub Issues: [Report a bug](https://github.com/Agarwalchetan/MedAI-HealthCare/issues)
- GitHub Discussions: [Ask questions](https://github.com/Agarwalchetan/MedAI-HealthCare/discussions)

### Contact
- Email: support@medai.com

---

## What's Next?

Now that you have MedAI running:

1. ✅ Explore the user interface
2. ✅ Test different features
3. ✅ Read the documentation
4. ✅ Start contributing!

**Happy coding! 🚀**

---

For more detailed information, see the [main README](../README.md).
