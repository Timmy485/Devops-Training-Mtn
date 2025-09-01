# DevSecOps Training Project

A secure, containerized backend service that provides health monitoring and mobile money payment services for the DevSecOps Training Portal.

## Features

### 🏥 Health Monitoring
- **System Health Checks**: Monitor application and system health status
- **Readiness Probes**: Kubernetes-ready readiness checks
- **Liveness Probes**: Application liveness monitoring
- **Detailed System Info**: Comprehensive system resource information
- **Uptime Monitoring**: Track application uptime and performance

### 💰 MoMo Payment Services
- **Money Transfers**: Transfer money to MoMo subscribers and other networks
- **Bill Payments**: Process utility and service bill payments
- **Airtime & Data**: Purchase airtime and data bundles
- **Scheduled Services**: Schedule airtime purchases
- **Cashout Management**: Allow and manage cashout operations
- **Balance Inquiries**: Check account balances
- **Approval Workflows**: Manage transaction approvals
- **Bank Integration**: Bank to wallet and wallet to bank transfers
- **Loan Services**: Process loan requests
- **MoMo Pay**: Digital payment processing

### 🔒 Security Features
- **API Key Authentication**: Secure access with configurable API keys
- **Rate Limiting**: Prevent API abuse with configurable limits
- **Input Validation**: Joi schemas for all request data
- **CORS**: Configurable cross-origin resource sharing
- **HTTPS**: TLS required in production
- **Request Logging**: Comprehensive audit logging

### 🐳 Containerization
- **Node.js Application**: Express.js backend with modern JavaScript
- **Health Checks**: Application health probes
- **Resource Limits**: Configurable CPU and memory limits
- **Security Context**: Proper security settings for production use
- **Environment Configuration**: Flexible environment-based configuration

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebApp        │    │   Training      │    │   Payment       │
│   (Frontend)    │───▶│   Project       │───▶│   Providers     │
└─────────────────┘    │   (Backend)     │    │   (MoMo APIs)   │
                       └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Health        │
                       │   Monitoring    │
                       │   System        │
                       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Logging       │
                       │   & Audit       │
                       │   System        │
                       └─────────────────┘
```

### Code Organization
The Training Project follows a clean separation of concerns with the following structure:

```
training-project/
├── app.js                 # Main Express application
├── package.json           # Dependencies and scripts
├── Dockerfile            # Node.js container definition
├── docker-compose.yml    # Local development setup
├── deployment-artefacts/ # Kubernetes deployment manifests
├── controllers/          # Business logic handlers with built-in validation
│   ├── health.controller.js      # Health check endpoints
│   └── momo.controller.js        # MoMo payment services
├── middlewares/          # Express middleware
│   ├── apiAuth.js               # API key authentication
│   ├── errorHandler.js          # Global error handling
│   ├── rateLimiter.js           # Rate limiting
├── routes/               # API route definitions (clean and simple)
│   ├── health.routes.js         # Health check endpoints
│   ├── momo.routes.js           # MoMo payment services
│   └── index.js                 # Main router configuration
├── public/               # Static files and downloads
│   └── downloads/              # File downloads
├── utils/                # Utility functions
│   └── logger.js                # Winston-based logging
├── test/                 # Test files
└── logs/                 # Application logs
```

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Payment provider API credentials (for MoMo services)

## Quick Start

### Local Development

1. **Clone and Setup**
   ```bash
   cd training-project
   npm install
   cp env.example .env
   # Edit .env with your configuration
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Test the Application**
   ```bash
   curl http://localhost:3001/health
   ```

### Production Deployment

1. **Build the Image**
   ```bash
   docker build -t devsecops-training:latest .
   ```

2. **Deploy to Production**
   ```bash
   # Deploy using your preferred method (Docker, Kubernetes, etc.)
   docker run -d -p 3001:3001 devsecops-training:latest
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `API_KEY` | API authentication key | Required |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `LOG_LEVEL` | Logging level | `info` |
| `MOMO_API_KEY` | MoMo payment API key | Required |
| `MOMO_API_URL` | MoMo payment API URL | Required |
| `MOMO_MERCHANT_ID` | MoMo merchant ID | Required |

### Payment Provider Configuration

The application requires proper configuration of MoMo payment provider credentials. Ensure all required API keys and endpoints are configured in the environment variables.

## API Endpoints

### Health Checks
- `GET /health` - Basic health status
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe
- `GET /health/detailed` - Detailed system information

### MoMo Payment Services
- `POST /api/momo/transfer-to-subscriber` - Transfer money to MoMo subscriber
- `POST /api/momo/transfer-to-network` - Transfer to other network
- `POST /api/momo/bill-payment` - MoMo and bill payment
- `POST /api/momo/buy-airtime` - Buy airtime
- `POST /api/momo/buy-data` - Buy data
- `POST /api/momo/schedule-airtime` - Schedule airtime
- `POST /api/momo/allow-cashout` - Allow cashout
- `GET /api/momo/balance` - Balance check
- `GET /api/momo/approvals` - My approvals
- `POST /api/momo/bank-to-wallet` - Bank to wallet
- `POST /api/momo/wallet-to-bank` - Wallet to bank
- `POST /api/momo/loan-request` - Loan request
- `POST /api/momo/pay` - MoMo pay

### File Downloads
- `GET /downloads/:filename` - Download files from the application
{
  "success": true,
  "command": "get pods",
  "stdout": "pod output...",
  "stderr": "",
  "exitCode": 0,
  "executionTime": 150,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "downloadFile": {
    "filename": "kubectl_my-request-123_2024-01-01T00-00-00-000Z.txt",
    "filepath": "/downloads/kubectl_my-request-123_2024-01-01T00-00-00-000Z.txt",
    "size": 1024,
    "requestId": "my-request-123"
  }
}
```

### Download File Content

Downloaded files contain structured information:

## Usage Examples

### Health Check
```bash
# Basic health check
curl http://localhost:3001/health

# Detailed health information
curl http://localhost:3001/health/detailed

# Readiness probe
curl http://localhost:3001/health/ready

# Liveness probe
curl http://localhost:3001/health/live
```

### MoMo Payment Services
```bash
# Check balance
curl -X GET http://localhost:3001/api/momo/balance \
  -H "x-api-key: your-api-key"

# Transfer money to subscriber
curl -X POST http://localhost:3001/api/momo/transfer-to-subscriber \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "233244123456",
    "amount": 100.00,
    "description": "Payment for services"
  }'

# Buy airtime
curl -X POST http://localhost:3001/api/momo/buy-airtime \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "233244123456",
    "amount": 50.00,
    "provider": "MTN"
  }'

# Bank to wallet transfer
curl -X POST http://localhost:3001/api/momo/bank-to-wallet \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "accountNumber": "1234567890",
    "amount": 500.00,
    "description": "Bank transfer"
  }'
```

**Raw Command Examples:**
- `stern app=web --tail 100` - Basic log retrieval
- `stern app=api -n backend --tail 200 --since 60m` - Namespace and time filtering
- `stern app=db -c postgres --tail 1000 --follow` - Container-specific with follow
- `stern "app=frontend,environment=prod" --tail 500` - Complex label selector

### Download Generated Files
```bash
# After executing a command with requestId, download the file
curl -O http://localhost:3001/downloads/kubectl_my-request-123_2024-01-01T00-00-00-000Z.txt
```

## MCP (Model Context Protocol) Features

### Available MCP Tools

#### Kubernetes Operations (9 tools)
- `execute_kubectl` - Custom kubectl commands
- `get_pods`, `get_services`, `get_deployments`
- `get_nodes`, `get_namespaces`
- `get_logs` - Using stern for log streaming
- `describe_resource` - Resource details
- `get_cluster_status` - Cluster health

#### Connectivity Testing (6 tools)
- `test_curl` - HTTP connectivity with metrics
- `test_telnet` - TCP connectivity
- `test_dns` - DNS resolution
- `test_ping` - Network connectivity
- `scan_ports` - Port scanning
- `batch_connectivity_test` - Parallel testing

### MCP Usage

#### Via HTTP API
```bash
# List available tools
curl -H "x-api-key: your-api-key" http://localhost:3001/api/mcp/tools

# Execute tool
curl -X POST http://localhost:3001/api/mcp/execute \
  -H "x-api-key: your-api-key" \
  -d '{"tool": "get_pods", "args": {"namespace": "default"}}'
```

#### Via MCP Client
```javascript
const { MCPClient } = require('./mcp/client');

const client = new MCPClient();
await client.connect();

// Get pods
const pods = await client.getPods('default', 'json');

// Test connectivity
const curlTest = await client.testCurl('https://httpbin.org/get');

await client.disconnect();
```

## Security Considerations

### API Security
- API key authentication required for all protected endpoints
- Rate limiting prevents abuse
- Input validation using Joi schemas in controllers
- CORS configuration for web security
- HTTPS required in production

### Application Security
- Non-root container execution
- Input sanitization and validation
- Proper error handling and logging
- Request tracking for audit purposes

### File Download Security
- Files stored in container volume
- No external file system access
- Request tracking for audit purposes
- Automatic file cleanup

## Monitoring and Observability

### Health Checks
- `/health` endpoint for load balancer health checks
- `/health/ready` for application readiness checks
- `/health/live` for application liveness checks

### Logging
- Winston-based structured logging
- File and console output
- Log rotation and size limits
- Request/response logging with request tracking

### Metrics
- Request duration tracking
- Error rate monitoring
- Resource usage metrics

### File Tracking
- Download file creation logging
- File size and metadata tracking
- Request correlation in logs

## Testing

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Health tests only
npm test -- --testPathPattern=health.test.js

# MoMo tests only
npm test -- --testPathPattern=momo.test.js

# API tests only
npm test -- --testPathPattern=api.test.js
```

### Test Health Endpoints
```bash
# Test health endpoints
curl http://localhost:3001/health
curl http://localhost:3001/health/detailed
curl http://localhost:3001/health/ready
curl http://localhost:3001/health/live
```

### Test MoMo Services
```bash
# Test MoMo endpoints
curl -X GET http://localhost:3001/api/momo/balance \
  -H "x-api-key: your-api-key"
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify API key configuration
   - Check environment variables
   - Ensure proper secret mounting

2. **MoMo Service Issues**
   - Check MoMo API credentials
   - Verify payment provider configuration
   - Check network connectivity to payment APIs

3. **Health Check Failures**
   - Check application logs
   - Verify Redis connectivity
   - Check system resources

4. **File Download Issues**
   - Check downloads directory permissions
   - Verify volume mounts
   - Check container storage space

### Debug Mode
```bash
# Enable debug logging
export LOG_LEVEL=debug

# Check container logs
docker logs devsecops-training-dev

# Test health endpoints
curl http://localhost:3001/health/detailed

# Test MoMo endpoints
curl -X GET http://localhost:3001/api/momo/balance \
  -H "x-api-key: your-api-key"

# Check application logs
tail -f logs/application-*.log
```

## Development

### Project Structure
```
training-project/
├── app.js                 # Main application file
├── package.json           # Dependencies and scripts
├── Dockerfile            # Container definition
├── docker-compose.yml    # Local development setup
├── deployment-artefacts/ # Kubernetes manifests
├── controllers/          # Business logic handlers with validation
├── middlewares/          # Express middleware
├── routes/               # API route definitions
├── public/               # Static files and downloads
├── utils/                # Utility functions
├── test/                 # Test files
└── logs/                 # Application logs
```

### Adding New Controllers
1. Create controller file in `controllers/` directory
2. Implement handler methods with proper error handling
3. Create route file in `routes/` directory
4. Add routes to main `routes/index.js`
5. Add comprehensive tests
6. Update documentation

### Adding New MoMo Services
1. Add new method to `momo.controller.js`
2. Implement business logic with proper validation
3. Add route to `momo.routes.js`
4. Add authentication middleware if required
5. Add comprehensive tests
6. Update documentation

### Adding New Health Checks
1. Add new method to `health.controller.js`
2. Implement health check logic
3. Add route to `health.routes.js`
4. Add tests for health functionality
5. Update documentation

### Testing
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Lint code
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue in the repository
- Contact the DevSecOps Training team
- Check the troubleshooting section
- Review the API documentation above

---

**Note**: This Training Project is designed to run in containerized environments with proper security configurations. Always review security settings and adjust permissions based on your specific deployment requirements. 