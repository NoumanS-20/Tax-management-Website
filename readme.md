# FinStack India - Advanced Tax Management System

A comprehensive, industry-level tax management platform built with React, Node.js, and MongoDB. This system provides end-to-end tax management capabilities for individuals, accountants, and administrators.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure JWT-based authentication with role-based access control
- **Tax Form Management** - Complete ITR form creation, editing, and submission workflow
- **Document Management** - Advanced file upload, processing, and verification system
- **Tax Calculator** - Real-time tax calculation with multiple deduction options
- **Notification System** - Comprehensive notification and reminder system
- **Analytics Dashboard** - Real-time analytics and reporting for all user types

### User Roles
- **Individual Users** - Create and manage their own tax returns
- **Accountants** - Review and manage client tax forms
- **Administrators** - System-wide management and analytics

### Advanced Features
- **Security** - Industry-standard security with rate limiting, data sanitization, and CORS protection
- **File Processing** - OCR and document verification capabilities
- **Real-time Updates** - Live notifications and status updates
- **Mobile Responsive** - Fully responsive design for all devices
- **Scalable Architecture** - Microservices-ready with Docker containerization

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hot Toast** for notifications
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Helmet** for security headers
- **Rate Limiting** for API protection

### DevOps & Deployment
- **Docker** containerization
- **Docker Compose** for local development
- **Nginx** reverse proxy
- **MongoDB** database
- **Redis** for caching
- **Winston** for logging

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB 7.0+
- Docker (optional, for containerized deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tax-management-website
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment files
   cp server/env.example server/.env
   
   # Edit server/.env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   
   # Or install MongoDB locally
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

### Docker Deployment

1. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/finstack-india

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📱 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Tax Management Endpoints
- `POST /api/tax` - Create tax form
- `GET /api/tax` - Get user's tax forms
- `GET /api/tax/:id` - Get specific tax form
- `PUT /api/tax/:id` - Update tax form
- `POST /api/tax/:id/submit` - Submit for review
- `GET /api/tax/:id/summary` - Get tax calculation summary

### Document Management Endpoints
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - Get user documents
- `GET /api/documents/:id` - Get specific document
- `GET /api/documents/:id/download` - Download document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd server
npm test

# Frontend tests
npm test

# E2E tests
npm run test:e2e
```

### Test Coverage
```bash
# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   cd server && npm run build
   ```

2. **Deploy with Docker**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Environment setup**
   - Configure production environment variables
   - Set up SSL certificates
   - Configure domain and DNS

### Cloud Deployment Options

- **AWS** - EC2, RDS, S3, CloudFront
- **Google Cloud** - Compute Engine, Cloud SQL, Cloud Storage
- **Azure** - App Service, Cosmos DB, Blob Storage
- **DigitalOcean** - Droplets, Managed Databases

## 🔒 Security Features

- **Authentication** - JWT-based with refresh tokens
- **Authorization** - Role-based access control
- **Rate Limiting** - API request throttling
- **Data Sanitization** - XSS and NoSQL injection protection
- **CORS Protection** - Configured origins only
- **File Upload Security** - Type and size validation
- **Password Security** - Bcrypt hashing with salt rounds
- **Security Headers** - Helmet.js protection

## 📊 Monitoring & Logging

- **Winston Logging** - Structured logging with levels
- **Health Checks** - Application and database health monitoring
- **Error Tracking** - Comprehensive error handling and reporting
- **Performance Monitoring** - Request timing and metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@finstack.com
- Documentation: [docs.finstack.com](https://docs.finstack.com)

## 🗺️ Roadmap

### Version 2.0 (Q2 2024)
- [ ] AI-powered tax optimization suggestions
- [ ] Advanced analytics and reporting
- [ ] Mobile application (React Native)
- [ ] Integration with banking APIs
- [ ] Automated tax filing with government portals

### Version 3.0 (Q4 2024)
- [ ] Multi-tenant architecture
- [ ] Advanced document processing with ML
- [ ] Real-time collaboration features
- [ ] Advanced security with 2FA
- [ ] International tax support

---

**Built with ❤️ for the Indian tax ecosystem**