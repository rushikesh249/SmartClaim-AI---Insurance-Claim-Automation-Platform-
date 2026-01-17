# SmartClaim AI - Insurance Claim Automation Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg)](https://www.typescriptlang.org/)

A cutting-edge insurance claim automation platform that leverages AI-powered document processing, fraud detection, and automated claim evaluation to streamline the insurance claims process.

## 🏆 Key Features

### 🤖 AI-Powered Capabilities
- **OCR Processing**: Automatic extraction of data from medical bills, police reports, and insurance documents
- **Image Deduplication**: Prevents duplicate document submissions using perceptual hashing
- **Fraud Detection**: ML-based risk scoring to identify potentially fraudulent claims
- **Automated Decision Making**: Smart algorithms for claim approval/rejection based on policy terms

### 📋 Core Functionality
- **Policy Management**: Digital policy linking and verification
- **Claim Lifecycle**: End-to-end claim processing from submission to settlement
- **Document Management**: Secure upload, storage, and retrieval of claim documents
- **Real-time Timeline**: Track claim progress with detailed activity logs
- **Risk Assessment**: Comprehensive readiness and fraud scoring
- **PDF Generation**: Automated claim summary reports

### 🔒 Security & Compliance
- **JWT Authentication**: Secure token-based user authentication
- **Role-based Access**: Fine-grained permission controls
- **Encrypted Storage**: AES-256 encryption for sensitive data
- **Audit Trail**: Complete logging of all system activities
- **GDPR Compliant**: Data privacy and protection standards

## 🚀 Technology Stack

### Backend (Python/FastAPI)
```
Framework: FastAPI 0.109.0
Database: PostgreSQL 15 + SQLAlchemy 2.0
ORM: SQLAlchemy 2.0 with async support
Authentication: JWT with OAuth2
Validation: Pydantic v2
Migrations: Alembic
Testing: pytest + pytest-asyncio
Logging: Structured logging with loguru
Containerization: Docker + Docker Compose
```

### Frontend (React/TypeScript)
```
Framework: React 18.2 + TypeScript 5.0
Build Tool: Vite 5.x
UI Library: TailwindCSS + shadcn/ui components
State Management: Zustand/Pinia-like patterns
HTTP Client: Axios with interceptors
Routing: React Router v6
Form Handling: React Hook Form + Zod
Notifications: Sonner/Toast notifications
```

### Infrastructure
```
Deployment: Docker Compose (Development)
CI/CD: GitHub Actions (Planned)
Monitoring: Prometheus + Grafana (Planned)
Logging: ELK Stack (Planned)
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Frontend      │    │   API Gateway    │    │   Microservices  │
│   (React)       │◄──►│   (FastAPI)      │◄──►│   (Modular)      │
└─────────────────┘    └──────────────────┘    └──────────────────┘
                              │                         │
                              ▼                         ▼
                    ┌──────────────────┐    ┌──────────────────┐
                    │   PostgreSQL     │    │   File Storage   │
                    │   (Primary DB)   │    │   (Documents)    │
                    └──────────────────┘    └──────────────────┘
```

## 📁 Project Structure

```
smartclaim-ai/
├── backend/                    # FastAPI Backend Service
│   ├── app/
│   │   ├── api/               # API endpoints (v1)
│   │   │   └── v1/
│   │   │       ├── endpoints/ # Individual endpoint handlers
│   │   │       └── router.py  # API version router
│   │   ├── models/            # SQLAlchemy database models
│   │   ├── schemas/           # Pydantic validation schemas
│   │   ├── services/          # Business logic layer
│   │   ├── utils/             # Utility functions
│   │   ├── db/                # Database configuration
│   │   ├── config.py          # Application configuration
│   │   └── main.py            # FastAPI application entry
│   ├── alembic/               # Database migrations
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Backend container
│   └── docker-compose.yml     # Service orchestration
│
├── frontend/                   # React Frontend Application
│   ├── src/
│   │   ├── api/               # API service clients
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   ├── stores/            # State management
│   │   ├── types/             # TypeScript interfaces
│   │   ├── layouts/           # Page layouts
│   │   └── lib/               # Utility libraries
│   ├── public/                # Static assets
│   ├── package.json           # Node.js dependencies
│   └── vite.config.ts         # Vite configuration
│
├── uploads/                    # File storage directory
├── .github/                    # GitHub workflows (CI/CD)
├── docker-compose.yml          # Root-level orchestration
└── README.md                   # Project documentation
```

## 🛠️ Quick Start Guide

### Prerequisites
- Docker Desktop (v4.0+) and Docker Compose
- Node.js 18+ and npm 9+
- Git

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/smartclaim-ai.git
cd smartclaim-ai
```

2. **Environment Setup**
```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration  
cp frontend/.env.example frontend/.env
```

3. **Start Backend Services**
```bash
cd backend
docker-compose up --build
```

4. **Start Frontend Development Server**
```bash
cd frontend
npm install
npm run dev
```

5. **Access Applications**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/v1/health

### Alternative: Single Command Startup
```bash
# From project root
./start.sh        # Linux/Mac
./start.ps1       # Windows PowerShell
```

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/v1/auth/register     # User Registration
POST /api/v1/auth/login        # User Login
GET  /api/v1/auth/me           # Current User Info
```

### Core Business Endpoints
```
POST /api/v1/policies/link     # Link Insurance Policy
GET  /api/v1/policies/         # List User Policies
POST /api/v1/claims/           # Create New Claim
GET  /api/v1/claims/           # List User Claims
GET  /api/v1/claims/{id}       # Get Claim Details
POST /api/v1/claims/{id}/submit # Submit Claim for Processing
```

### Document Management
```
POST /api/v1/claims/{id}/documents     # Upload Document
GET  /api/v1/claims/{id}/documents     # List Claim Documents
GET  /api/v1/files/{id}/view           # View Document
GET  /api/v1/files/{id}/download       # Download Document
```

### Analytics & Reporting
```
GET /api/v1/claims/{id}/timeline       # Claim Activity Timeline
GET /api/v1/claims/{id}/risk           # Risk Assessment
GET /api/v1/claims/{id}/summary-pdf    # Generate PDF Summary
```

## 🔧 Development Workflow

### Backend Development
```bash
# Activate virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest tests/ -v

# Database migrations
alembic revision --autogenerate -m "Migration description"
alembic upgrade head
```

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Lint code
npm run lint
```

### Code Quality Standards
- **Backend**: Black formatting, flake8 linting, mypy type checking
- **Frontend**: ESLint with TypeScript rules, Prettier formatting
- **Git**: Conventional commits, pull request templates
- **Testing**: 80%+ code coverage requirement

## 🗄️ Database Schema

### Core Entities
- **Users**: Authentication and profile management
- **Policies**: Insurance policy information and coverage details
- **Claims**: Claim submissions and processing status
- **Documents**: Uploaded supporting documents with metadata
- **Timeline Events**: Audit trail of claim activities
- **Risk Assessments**: Fraud detection and readiness scoring

### Key Relationships
```
Users 1→N Policies
Users 1→N Claims
Policies 1→N Claims
Claims 1→N Documents
Claims 1→N TimelineEvents
Claims 1→1 RiskAssessment
```

## 🚀 Deployment Guide

### Production Checklist
- [ ] Update JWT secrets to secure random values
- [ ] Configure production database connection
- [ ] Set up SSL certificates (HTTPS)
- [ ] Configure CORS for production domains
- [ ] Set up monitoring and alerting
- [ ] Implement backup strategy
- [ ] Configure logging aggregation
- [ ] Set up CI/CD pipeline

### Docker Production Deployment
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy services
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

## 🧪 Testing Strategy

### Backend Testing
```bash
# Unit tests
pytest tests/unit/

# Integration tests  
pytest tests/integration/

# API contract tests
pytest tests/contract/

# Performance tests
pytest tests/performance/ -s
```

### Frontend Testing
```bash
# Component tests
npm run test:components

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Visual regression tests
npm run test:visual
```

## 📈 Monitoring & Observability

### Metrics Collection
- API response times and throughput
- Database query performance
- User authentication statistics
- File upload/download metrics
- Error rates and exception tracking

### Logging Levels
```
DEBUG: Detailed diagnostic information
INFO: General operational messages
WARNING: Potential issues requiring attention
ERROR: Handled exceptions and failures
CRITICAL: System-level failures
```

## 🔒 Security Best Practices

### Authentication & Authorization
- JWT tokens with short expiration times
- Role-based access control (RBAC)
- Multi-factor authentication (planned)
- Session management and revocation

### Data Protection
- Encryption at rest and in transit
- Secure file upload validation
- Input sanitization and validation
- SQL injection prevention
- XSS protection

### Infrastructure Security
- Container security scanning
- Regular dependency updates
- Network segmentation
- Security audit logging

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Standards
- Follow conventional commit messages
- Maintain 80%+ test coverage
- Pass all CI/CD checks
- Update documentation as needed
- Follow established code style guides

## 📚 Learning Resources

### Official Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Recommended Learning Paths
- **Backend Developers**: FastAPI → SQLAlchemy → PostgreSQL → Docker
- **Frontend Developers**: React → TypeScript → Vite → TailwindCSS
- **Full Stack**: Complete both tracks plus DevOps fundamentals

## 🆘 Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check Docker logs
docker-compose logs backend

# Verify environment variables
cat backend/.env

# Check database connectivity
docker-compose exec db pg_isready
```

**Frontend build fails:**
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check environment variables
cat frontend/.env
```

**Database migration errors:**
```bash
# Reset database
docker-compose down -v
docker-compose up -d db
docker-compose exec backend alembic upgrade head
```

### Getting Help
- Check existing [GitHub Issues](https://github.com/yourusername/smartclaim-ai/issues)
- Join our [Discord Community](https://discord.gg/smartclaim)
- Email support: support@smartclaim.ai

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Core Team

- **Lead Developer**: [Your Name] - Full Stack Engineering
- **Backend Specialist**: [Team Member] - Python/FastAPI Expert
- **Frontend Lead**: [Team Member] - React/TypeScript Specialist
- **DevOps Engineer**: [Team Member] - Infrastructure & Deployment

## 🙏 Acknowledgments

- Thanks to the FastAPI community for excellent documentation
- Shoutout to the React team for continuous improvements
- Appreciation to all open-source contributors whose libraries we use
- Special thanks to early beta testers and feedback providers

---

<p align="center">
  <strong>Built with ❤️ for the insurance industry</strong>
</p>

<p align="center">
  <a href="#top">Back to top</a>
</p>

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Application configuration
│   ├── dependencies.py      # Shared dependencies
│   ├── db/
│   │   ├── base.py         # SQLAlchemy base model
│   │   └── session.py      # Database session management
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic schemas
│   ├── api/
│   │   └── v1/
│   │       ├── router.py   # API v1 router
│   │       └── endpoints/
│   │           └── healthcheck.py
│   ├── services/           # Business logic layer
│   └── utils/
│       ├── logger.py       # Structured logging
│       └── constants.py    # Application constants
├── alembic/                # Database migrations
├── alembic.ini             # Alembic configuration
├── requirements.txt        # Python dependencies
├── docker-compose.yml      # Docker services
├── Dockerfile              # Backend container
├── .env                    # Environment variables (local)
└── .env.example            # Environment template
```

## 🛠️ Setup Instructions

### Prerequisites

- Docker Desktop installed
- Docker Compose v3.8+

### Quick Start

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

3. **Start services**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the FastAPI backend container
   - Start PostgreSQL database
   - Run database migrations (if any)
   - Start the API server on port 8000

4. **Verify installation**
   - API Documentation: http://localhost:8000/docs
   - Root endpoint: http://localhost:8000
   - Health check: http://localhost:8000/api/v1/health

## 🗄️ Database Migrations

The project uses Alembic for database schema management.

### Create a new migration

```bash
# Access the backend container
docker-compose exec backend bash

# Generate migration from model changes
alembic revision --autogenerate -m "description of changes"

# Apply migrations
alembic upgrade head
```

### Migration commands

```bash
# View current migration version
alembic current

# View migration history
alembic history

# Rollback one migration
alembic downgrade -1

# Rollback all migrations
alembic downgrade base
```

## 📝 Environment Variables

Key environment variables in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | SmartClaim AI |
| `API_PREFIX` | API route prefix | /api/v1 |
| `DATABASE_URL` | PostgreSQL connection string | postgresql://... |
| `JWT_SECRET` | JWT signing secret | (change in production) |
| `JWT_ALGORITHM` | JWT algorithm | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | 60 |
| `UPLOAD_DIR` | File upload directory | uploads |
| `LOG_LEVEL` | Logging level | INFO |

## 🧪 API Endpoints

### Current Endpoints

- `GET /` - Welcome message
- `GET /api/v1/health` - Health check with database status

### Future Endpoints (to be implemented)

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/claims` - Create claim
- `GET /api/v1/claims` - List claims
- And more...

## 🔧 Development

### Run without Docker

1. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Update DATABASE_URL in .env** to point to local PostgreSQL

4. **Run migrations**
   ```bash
   alembic upgrade head
   ```

5. **Start server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Code Structure Guidelines

- **Models**: Define in `app/models/` - SQLAlchemy ORM models
- **Schemas**: Define in `app/schemas/` - Pydantic request/response models
- **Endpoints**: Define in `app/api/v1/endpoints/` - API route handlers
- **Services**: Define in `app/services/` - Business logic
- **Utils**: Define in `app/utils/` - Helper functions

## 📊 Logging

The application uses structured logging with:
- Timestamp
- Log level
- Module name
- Message

Logs are output to stdout and can be viewed with:
```bash
docker-compose logs -f backend
```

## 🚢 Production Considerations

Before deploying to production:

1. ✅ Change `JWT_SECRET` to a strong random value
2. ✅ Update CORS origins in `app/main.py` to specific domains
3. ✅ Set `DEBUG=False` in production
4. ✅ Use managed PostgreSQL service
5. ✅ Configure proper logging aggregation
6. ✅ Set up SSL/TLS certificates
7. ✅ Implement rate limiting
8. ✅ Add monitoring and alerting

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)

## 📄 License

TBD

## 👥 Contributors

TBD
