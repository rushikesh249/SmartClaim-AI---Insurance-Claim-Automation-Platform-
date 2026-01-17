# SmartClaim AI - Backend

Insurance Claim Automation Platform built with FastAPI, PostgreSQL, and SQLAlchemy.

## 🚀 Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Validation**: Pydantic
- **Container**: Docker & Docker Compose

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
