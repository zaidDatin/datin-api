# Datin API (Backend)

Express.js TypeScript API for the Datin platform.

## 🚀 Tech Stack

- **Framework**: Express.js
- **Language**: TypeScript
- **Runtime**: Node.js 20
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 20+
- npm 9+

## 🛠️ Local Development

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

The API will be available at [http://localhost:4000](http://localhost:4000)

### Environment Variables

Create a `.env` file:

```env
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
VALIDATION_SERVICE_URL=http://localhost:8000
```

## 🐳 Docker

### Build image

```bash
docker build -t datin-api .
```

### Run container

```bash
docker run -p 4000:4000 \
  -e VALIDATION_SERVICE_URL=http://datin-validation-service:8000 \
  -e ALLOWED_ORIGINS=http://localhost:3000 \
  datin-api
```

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check

```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "services": {
    "validation": true
  },
  "version": "1.0.0"
}
```

### Data Operations

#### Get all data

```bash
GET /api/data
```

#### Create data (with validation)

```bash
POST /api/data
Content-Type: application/json

{
  "name": "test-record",
  "value": 123
}
```

#### Get single record

```bash
GET /api/data/:id
```

## 📦 Deployment

This repository is configured with GitHub Actions for automated deployment to AWS ECS Fargate.

### Required GitHub Secrets

- `AWS_ROLE_ARN`: IAM role ARN for OIDC authentication

### Deployment Flow

1. Push to `main` branch
2. GitHub Actions builds Docker image
3. Image is pushed to AWS ECR
4. ECS task definition is updated
5. ECS service is deployed with new image

### Manual Deployment

```bash
# Trigger workflow manually
gh workflow run deploy.yml
```

## 🔍 Health Checks

- **Endpoint**: `/health`
- **Docker Health Check**: Runs every 30s
- **Checks**: Validation service availability

## 📁 Project Structure

```
datin-api/
├── src/
│   ├── routes/
│   │   ├── health.ts
│   │   └── data.ts
│   └── index.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

## 🤝 Contributing

See [CODEOWNERS](./CODEOWNERS) for team ownership information.

## 📄 License

Proprietary - Datin Platform
