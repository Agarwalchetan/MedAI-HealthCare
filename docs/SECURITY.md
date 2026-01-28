# Security Guide

Security best practices and guidelines for the MedAI Healthcare Platform.

## Table of Contents

- [Security Overview](#security-overview)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [API Security](#api-security)
- [Frontend Security](#frontend-security)
- [Database Security](#database-security)
- [Third-Party Services](#third-party-services)
- [Security Checklist](#security-checklist)
- [Reporting Vulnerabilities](#reporting-vulnerabilities)

---

## Security Overview

MedAI handles sensitive healthcare data and must comply with healthcare regulations including HIPAA. This document outlines security measures implemented and best practices to follow.

### Security Principles

1. **Defense in Depth**: Multiple layers of security
2. **Least Privilege**: Minimum necessary access
3. **Fail Securely**: Secure defaults and error handling
4. **Complete Mediation**: Check every access
5. **Open Design**: Security through design, not obscurity

---

## Authentication & Authorization

### Password Security

#### Password Requirements

```javascript
// Minimum requirements enforced
const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false
};
```

#### Password Hashing

```javascript
// Using bcrypt with 12 salt rounds
const bcrypt = require('bcryptjs');

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// Verify password
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

**Best Practices:**
- Never store passwords in plain text
- Use bcrypt with minimum 12 salt rounds
- Never log passwords
- Implement password strength meter on frontend

### JWT Token Security

#### Token Configuration

```javascript
const jwt = require('jsonwebtoken');

// Generate token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
      issuer: 'medai-platform',
      audience: 'medai-users'
    }
  );
};

// Verify token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    issuer: 'medai-platform',
    audience: 'medai-users'
  });
};
```

#### Token Storage

```javascript
// Store in HttpOnly cookie
res.cookie('token', token, {
  httpOnly: true,      // Prevents XSS attacks
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

**Best Practices:**
- Use HttpOnly cookies for token storage
- Set secure flag in production
- Implement token refresh mechanism
- Invalidate tokens on logout
- Use short expiration times for sensitive operations

### Role-Based Access Control (RBAC)

```javascript
// Middleware for role-based access
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

// Usage
router.get('/admin/users', 
  authenticate, 
  authorize('admin', 'super-admin'), 
  getUsers
);
```

### Account Security

#### Login Attempt Limiting

```javascript
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

const handleFailedLogin = async (user) => {
  user.loginAttempts += 1;
  
  if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    user.lockUntil = Date.now() + LOCK_TIME;
  }
  
  await user.save();
};

const isLocked = (user) => {
  return user.lockUntil && user.lockUntil > Date.now();
};
```

#### Two-Factor Authentication (2FA)

```javascript
// Generate 2FA secret
const speakeasy = require('speakeasy');

const generate2FASecret = () => {
  return speakeasy.generateSecret({
    name: 'MedAI',
    length: 32
  });
};

// Verify 2FA token
const verify2FAToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2
  });
};
```

---

## Data Protection

### Data Encryption

#### Encryption at Rest

```javascript
const crypto = require('crypto');

// Encrypt sensitive data
const encrypt = (text) => {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};

// Decrypt sensitive data
const decrypt = (encrypted, iv, authTag) => {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
```

#### Encryption in Transit

```javascript
// Force HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// HSTS Header
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
```

### Data Sanitization

```javascript
// Input sanitization
const sanitize = require('mongo-sanitize');
const validator = require('validator');

const sanitizeInput = (input) => {
  // Remove MongoDB operators
  let sanitized = sanitize(input);
  
  // Escape HTML
  if (typeof sanitized === 'string') {
    sanitized = validator.escape(sanitized);
  }
  
  return sanitized;
};

// Middleware
app.use((req, res, next) => {
  req.body = sanitizeInput(req.body);
  req.query = sanitizeInput(req.query);
  req.params = sanitizeInput(req.params);
  next();
});
```

### Sensitive Data Handling

```javascript
// Remove sensitive fields from responses
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  // ... other fields
});

// Don't include password in JSON responses
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verifyCode;
  delete user.twoFactorSecret;
  return user;
};

// Select specific fields
User.find().select('-password -verifyCode -twoFactorSecret');
```

---

## API Security

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per window
  skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);
```

### CORS Configuration

```javascript
const cors = require('cors');

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://yourdomain.com',
      'https://www.yourdomain.com'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

### Input Validation

```javascript
const Joi = require('joi');

// Validation schemas
const schemas = {
  userRegistration: Joi.object({
    fullName: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    age: Joi.number().min(1).max(120).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required()
  }),
  
  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    next();
  };
};

// Usage
router.post('/register', validate(schemas.userRegistration), register);
```

### Security Headers

```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.yourdomain.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true
}));
```

### API Key Security

```javascript
// Validate API keys
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ message: 'API key required' });
  }
  
  // Verify API key (use hashed comparison)
  const hashedKey = crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
  
  if (hashedKey !== process.env.API_KEY_HASH) {
    return res.status(403).json({ message: 'Invalid API key' });
  }
  
  next();
};
```

---

## Frontend Security

### XSS Prevention

```typescript
// Sanitize user input before rendering
import DOMPurify from 'dompurify';

const SafeHTML: React.FC<{ html: string }> = ({ html }) => {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href']
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};
```

### CSRF Protection

```typescript
// Include CSRF token in requests
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    'X-CSRF-Token': getCsrfToken()
  }
});
```

### Secure Storage

```typescript
// Never store sensitive data in localStorage
// Use sessionStorage for temporary data only

// Bad
localStorage.setItem('token', token);
localStorage.setItem('password', password);

// Good - Let backend handle tokens via HttpOnly cookies
// Store only non-sensitive UI preferences
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'en');
```

### Content Security Policy

```html
<!-- Add CSP meta tag -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               img-src 'self' data: https://res.cloudinary.com;
               font-src 'self' https://fonts.gstatic.com;">
```

---

## Database Security

### MongoDB Security

#### Connection Security

```javascript
// Use connection string with authentication
const mongoURI = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority`;

// Connection options
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  authSource: 'admin'
});
```

#### Query Security

```javascript
// Prevent NoSQL injection
const getUserByEmail = async (email) => {
  // Bad - vulnerable to injection
  const user = await User.findOne({ email: email });
  
  // Good - use parameterized queries
  const user = await User.findOne({ email: { $eq: email } });
  
  // Better - sanitize input
  const sanitizedEmail = sanitize(email);
  const user = await User.findOne({ email: sanitizedEmail });
};
```

#### Field-Level Encryption

```javascript
// Encrypt sensitive fields
const userSchema = new mongoose.Schema({
  email: String,
  ssn: {
    type: String,
    get: (value) => decrypt(value),
    set: (value) => encrypt(value)
  }
});

userSchema.set('toJSON', { getters: true });
```

### Database Access Control

```javascript
// Create database users with specific roles
// MongoDB shell commands:

// Create read-only user
db.createUser({
  user: "readonly",
  pwd: "secure_password",
  roles: [{ role: "read", db: "medai" }]
});

// Create read-write user
db.createUser({
  user: "app_user",
  pwd: "secure_password",
  roles: [{ role: "readWrite", db: "medai" }]
});

// Create admin user
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: [{ role: "dbAdmin", db: "medai" }]
});
```

---

## Third-Party Services

### API Key Management

```javascript
// Store API keys in environment variables
const config = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY
  },
  deepgram: {
    apiKey: process.env.DEEPGRAM_API_KEY
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }
};

// Never commit .env files
// Add to .gitignore
```

### Service Authentication

```javascript
// Validate webhook signatures
const validateWebhookSignature = (payload, signature, secret) => {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};
```

---

## Security Checklist

### Development

- [ ] All dependencies up to date
- [ ] No hardcoded secrets in code
- [ ] Environment variables properly configured
- [ ] Input validation on all endpoints
- [ ] Output encoding implemented
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't include sensitive data

### Authentication

- [ ] Passwords hashed with bcrypt (12+ rounds)
- [ ] JWT tokens stored in HttpOnly cookies
- [ ] Token expiration implemented
- [ ] Login attempt limiting enabled
- [ ] 2FA available for sensitive accounts
- [ ] Password reset flow secure

### Authorization

- [ ] Role-based access control implemented
- [ ] Least privilege principle followed
- [ ] Authorization checks on all protected routes
- [ ] User can only access own data

### Data Protection

- [ ] HTTPS enforced in production
- [ ] Sensitive data encrypted at rest
- [ ] Database backups encrypted
- [ ] PII handling compliant with regulations
- [ ] Data retention policies implemented

### API Security

- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers set (Helmet)
- [ ] API versioning implemented
- [ ] Request size limits set

### Database

- [ ] MongoDB authentication enabled
- [ ] Database user has minimum privileges
- [ ] IP whitelist configured
- [ ] Indexes created for performance
- [ ] Query sanitization implemented

### Monitoring

- [ ] Security logging enabled
- [ ] Failed login attempts logged
- [ ] Suspicious activity alerts configured
- [ ] Regular security audits scheduled

---

## Reporting Vulnerabilities

### Security Contact

If you discover a security vulnerability, please email:
**security@medai.com**

### Disclosure Policy

1. **Report**: Email security@medai.com with details
2. **Acknowledgment**: We'll respond within 48 hours
3. **Investigation**: We'll investigate and keep you updated
4. **Fix**: We'll develop and test a fix
5. **Release**: We'll release a security update
6. **Disclosure**: Coordinated public disclosure

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What Not to Do

- Don't publicly disclose before we've had time to fix
- Don't exploit the vulnerability
- Don't access data that isn't yours
- Don't perform DoS attacks

---

## Security Resources

### Tools

- **OWASP ZAP**: Security testing
- **npm audit**: Dependency vulnerabilities
- **Snyk**: Continuous security monitoring
- **SonarQube**: Code quality and security

### References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

## Regular Security Tasks

### Daily
- Monitor security logs
- Check for failed login attempts
- Review error logs

### Weekly
- Run `npm audit`
- Check for dependency updates
- Review access logs

### Monthly
- Security audit
- Update dependencies
- Review and rotate API keys
- Test backup restoration

### Quarterly
- Penetration testing
- Security training for team
- Review and update security policies
- Compliance audit

---

For more information, see the [main documentation](../README.md).
