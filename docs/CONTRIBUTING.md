# Contributing to MedAI

Thank you for your interest in contributing to MedAI! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB 6 or higher
- Git
- Code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/MedAI-HealthCare.git
   cd MedAI-HealthCare
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/Agarwalchetan/MedAI-HealthCare.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

---

## Development Workflow

### Branch Strategy

We use a simplified Git Flow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
# Update your local repository
git checkout develop
git pull upstream develop

# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Commit your changes
git add .
git commit -m "feat: add your feature description"

# Push to your fork
git push origin feature/your-feature-name
```

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream changes
git checkout develop
git merge upstream/develop

# Push to your fork
git push origin develop
```

---

## Coding Standards

### JavaScript/TypeScript Style Guide

We follow the Airbnb JavaScript Style Guide with some modifications.

#### General Rules

1. **Use meaningful variable names**
   ```javascript
   // Bad
   const d = new Date();
   const u = users.filter(x => x.active);

   // Good
   const currentDate = new Date();
   const activeUsers = users.filter(user => user.isActive);
   ```

2. **Use const and let, never var**
   ```javascript
   // Bad
   var count = 0;

   // Good
   const MAX_COUNT = 100;
   let count = 0;
   ```

3. **Use arrow functions for callbacks**
   ```javascript
   // Bad
   users.map(function(user) {
     return user.name;
   });

   // Good
   users.map(user => user.name);
   ```

4. **Use template literals**
   ```javascript
   // Bad
   const message = 'Hello, ' + name + '!';

   // Good
   const message = `Hello, ${name}!`;
   ```

#### Backend Code Style

1. **MVC Pattern**
   ```javascript
   // Controller - Handle HTTP requests
   exports.getUsers = async (req, res, next) => {
     try {
       const users = await userService.getAllUsers();
       return sendSuccess(res, 'Users retrieved successfully', { users });
     } catch (error) {
       next(error);
     }
   };

   // Service - Business logic
   exports.getAllUsers = async () => {
     return await User.find({ isActive: true })
       .select('-password')
       .sort({ createdAt: -1 });
   };

   // Model - Data structure
   const userSchema = new mongoose.Schema({
     fullName: { type: String, required: true },
     email: { type: String, required: true, unique: true }
   });
   ```

2. **Error Handling**
   ```javascript
   // Always use try-catch in async functions
   exports.createUser = async (req, res, next) => {
     try {
       const user = await userService.createUser(req.body);
       return sendSuccess(res, 'User created', { user }, 201);
     } catch (error) {
       next(error); // Pass to error middleware
     }
   };
   ```

3. **Validation**
   ```javascript
   // Use Joi for validation
   const userSchema = Joi.object({
     fullName: Joi.string().max(50).required(),
     email: Joi.string().email().required(),
     password: Joi.string().min(8).required()
   });
   ```

#### Frontend Code Style

1. **Component Structure**
   ```typescript
   // Use functional components with TypeScript
   interface UserProfileProps {
     userId: string;
     onUpdate: (user: User) => void;
   }

   export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
     const [user, setUser] = useState<User | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       fetchUser();
     }, [userId]);

     const fetchUser = async () => {
       try {
         const response = await userAPI.getProfile(userId);
         setUser(response.data.user);
       } catch (error) {
         console.error('Failed to fetch user:', error);
       } finally {
         setLoading(false);
       }
     };

     if (loading) return <LoadingSpinner />;
     if (!user) return <ErrorMessage />;

     return (
       <div className="user-profile">
         {/* Component JSX */}
       </div>
     );
   };
   ```

2. **State Management**
   ```typescript
   // Use hooks for state management
   const [formData, setFormData] = useState({
     name: '',
     email: ''
   });

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setFormData(prev => ({
       ...prev,
       [e.target.name]: e.target.value
     }));
   };
   ```

3. **API Calls**
   ```typescript
   // Centralize API calls in service files
   // src/modules/user/services/userAPI.ts
   export const userAPI = {
     getProfile: () => api.get('/users/profile'),
     updateProfile: (data: UpdateProfileData) => api.put('/users/profile', data),
     getMedicalHistory: () => api.get('/users/medical-history')
   };
   ```

### CSS/Styling

1. **Use TailwindCSS utility classes**
   ```jsx
   <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
     <h2 className="text-xl font-semibold text-gray-800">Title</h2>
     <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
       Action
     </button>
   </div>
   ```

2. **Responsive Design**
   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {/* Content */}
   </div>
   ```

### File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Services**: camelCase (e.g., `userService.js`)
- **Utilities**: camelCase (e.g., `dateHelper.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

---

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
# Feature
git commit -m "feat(user): add medical history management"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Documentation
git commit -m "docs(api): update API documentation for user endpoints"

# Refactoring
git commit -m "refactor(doctor): simplify appointment booking logic"

# Performance
git commit -m "perf(database): add indexes for faster queries"
```

### Commit Message Rules

1. Use present tense ("add feature" not "added feature")
2. Use imperative mood ("move cursor to..." not "moves cursor to...")
3. Limit first line to 72 characters
4. Reference issues and pull requests when applicable

---

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout feature/your-feature
   git rebase develop
   ```

2. **Run tests**
   ```bash
   npm run lint
   npm test
   ```

3. **Update documentation** if needed

### Creating a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature
   ```

2. **Create PR on GitHub**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select base: `develop` and compare: `feature/your-feature`
   - Fill in the PR template

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Screenshots (if applicable)

## Related Issues
Closes #issue_number
```

### Review Process

1. At least one maintainer must approve
2. All CI checks must pass
3. No merge conflicts
4. Code review feedback addressed

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Writing Tests

#### Backend Tests

```javascript
// Example: User service test
const { expect } = require('chai');
const userService = require('../services/userService');

describe('User Service', () => {
  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Test123'
      };

      const user = await userService.createUser(userData);
      
      expect(user).to.have.property('_id');
      expect(user.email).to.equal(userData.email);
      expect(user.password).to.not.equal(userData.password); // Should be hashed
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'existing@example.com',
        password: 'Test123'
      };

      try {
        await userService.createUser(userData);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('already exists');
      }
    });
  });
});
```

#### Frontend Tests

```typescript
// Example: Component test
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('renders user information', () => {
    const user = {
      fullName: 'John Doe',
      email: 'john@example.com'
    };

    render(<UserProfile user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onUpdate when form is submitted', () => {
    const onUpdate = jest.fn();
    const user = { fullName: 'John Doe', email: 'john@example.com' };

    render(<UserProfile user={user} onUpdate={onUpdate} />);
    
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Jane Doe' }
    });
    fireEvent.click(screen.getByText('Save'));

    expect(onUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: 'Jane Doe' })
    );
  });
});
```

---

## Documentation

### Code Documentation

1. **JSDoc for Functions**
   ```javascript
   /**
    * Creates a new user account
    * @param {Object} userData - User registration data
    * @param {string} userData.fullName - User's full name
    * @param {string} userData.email - User's email address
    * @param {string} userData.password - User's password
    * @returns {Promise<Object>} Created user object
    * @throws {Error} If email already exists
    */
   exports.createUser = async (userData) => {
     // Implementation
   };
   ```

2. **TypeScript Interfaces**
   ```typescript
   /**
    * User profile data structure
    */
   interface UserProfile {
     /** Unique user identifier */
     id: string;
     /** User's full name */
     fullName: string;
     /** User's email address */
     email: string;
     /** User's age */
     age: number;
     /** User's gender */
     gender: 'male' | 'female' | 'other';
   }
   ```

### README Updates

When adding new features, update relevant documentation:

- Main README.md
- API Documentation
- Setup guides
- Architecture diagrams

---

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 96]
- Node version: [e.g., 18.0.0]

**Additional context**
Any other relevant information
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution you'd like**
Clear description of desired functionality

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Mockups, examples, or references
```

---

## Community

### Getting Help

- **Documentation**: Check the `__Docs__` directory
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions

### Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project README

---

## License

By contributing to MedAI, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to MedAI! Your efforts help make healthcare more accessible for everyone. 🙏
