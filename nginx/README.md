# AuraSync with Nginx Integration

This directory contains the Nginx configuration and Docker setup for the AuraSync FastAPI project.

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───▶│    Nginx    │───▶│   FastAPI   │
│             │    │  (Port 80)  │    │ (Port 8000) │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   Next.js   │
                   │ (Port 3000) │
                   └─────────────┘
```

## ✨ Features

- **Reverse Proxy**: Nginx routes requests to appropriate services
- **Load Balancing**: Can handle multiple backend instances
- **Rate Limiting**: Protects against abuse (10 req/s for API)
- **Gzip Compression**: Reduces bandwidth usage
- **Security Headers**: Enhanced security (XSS, frame options, etc.)
- **SSL Support**: HTTPS configuration ready
- **Health Checks**: Monitors service health
- **File Upload Support**: 10MB max file size
- **Static File Serving**: Optimized caching for static assets
- **Error Handling**: Custom error pages
- **Logging**: Comprehensive access and error logs

## 🚀 Quick Start

### Prerequisites

1. **Install Docker Desktop** - Download from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Install Docker Compose** - Usually included with Docker Desktop
3. **Ensure Docker is running** - Start Docker Desktop and wait for it to fully load

### Starting the Services

#### Option 1: Using Batch Script (Windows)
1. Open Command Prompt in this directory (`final/nginx/`)
2. Run: `start_nginx.bat`

#### Option 2: Manual Docker Commands
```bash
# Navigate to nginx directory
cd final/nginx/

# Test configuration first
docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine nginx -t

# Build and start services
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### Stopping the Services

#### Option 1: Using Batch Script (Windows)
Run: `stop_nginx.bat`

#### Option 2: Manual Docker Commands
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop and remove images
docker-compose down --rmi all
```

## 🌐 Access Points

Once services are running, access your application at:

- **🎨 Frontend**: http://localhost
- **📚 API Documentation**: http://localhost/docs
- **🏥 Health Check**: http://localhost/health
- **🔧 API Endpoints**: http://localhost/api/*
- **📋 OpenAPI JSON**: http://localhost/openapi.json

### API Endpoints Available:
- `POST /api/analyze/face` - Face shape analysis
- `POST /api/analyze/body` - Body type analysis  
- `POST /api/analyze/skin-tone` - Skin tone analysis
- `POST /api/recommend` - Get fashion recommendations
- `POST /api/products` - Get filtered products
- `POST /api/user-analysis` - Save user analysis data

## ⚙️ Configuration

### Nginx Configuration (`nginx.conf`)

The main configuration file includes:

- **🔗 API Routes**: `/api/*` → FastAPI backend
- **🎨 Frontend Routes**: `/` → Next.js frontend
- **🛡️ Rate Limiting**: 10 requests/second for API
- **📁 File Upload**: 10MB max file size
- **🔒 Security Headers**: XSS protection, frame options, etc.
- **🗜️ Gzip Compression**: Reduces bandwidth usage
- **⏱️ Timeout Settings**: 60s for connect/send/read
- **📊 Logging**: Access and error logs

### Docker Compose (`docker-compose.yml`)

Manages three services:
- **🌐 nginx**: Reverse proxy (port 80/443)
- **🐍 fastapi**: Backend API (port 8000)
- **⚛️ nextjs**: Frontend (port 3000)

### Environment Variables (`env.example`)

Copy `env.example` to `.env` and configure:
- Port settings
- Database connections
- Security keys
- File upload limits

## 🔧 Customization

### Adding SSL/HTTPS

1. **Uncomment HTTPS block** in `nginx.conf`
2. **Add SSL certificates** to the configuration
3. **Update domain name** in server_name
4. **Restart services** to apply changes

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    # ... rest of configuration
}
```

### Changing Ports

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change external port
  - "8443:443" # Change SSL port
```

### Adding More Backend Instances

In `nginx.conf`, add more upstream servers:
```nginx
upstream fastapi_backend {
    server 127.0.0.1:8000;
    server 127.0.0.1:8001;
    server 127.0.0.1:8002;
}
```

### Custom Error Pages

Create custom error pages in `static/` directory:
- `404.html` - Page not found
- `50x.html` - Server errors

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nginx
docker-compose logs -f fastapi
docker-compose logs -f nextjs

# Follow specific log files
docker exec aurasync_nginx tail -f /var/log/nginx/access.log
docker exec aurasync_nginx tail -f /var/log/nginx/error.log
```

### Health Checks

```bash
# Nginx health check
curl http://localhost/health

# FastAPI health check
curl http://localhost:8000/health

# Next.js health check
curl http://localhost:3000

# Test API endpoints
curl -X POST http://localhost/api/analyze/body \
  -F "file=@test-image.jpg"
```

### Performance Monitoring

```bash
# Check container status
docker-compose ps

# Check resource usage
docker stats

# Check nginx configuration
docker exec aurasync_nginx nginx -t
```

## 🔧 Troubleshooting

### Common Issues

#### 1. **Port Already in Use**
```bash
# Check what's using the port
netstat -ano | findstr :80
netstat -ano | findstr :443

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change ports in docker-compose.yml
```

#### 2. **Docker Not Running**
- Start Docker Desktop
- Wait for it to fully load
- Check Docker Desktop settings

#### 3. **Build Failures**
```bash
# Clean and rebuild
docker-compose down
docker system prune -f
docker-compose up --build

# Check specific service logs
docker-compose logs fastapi
docker-compose logs nextjs
```

#### 4. **Permission Issues**
- Run Command Prompt as Administrator
- Check Docker Desktop settings
- Ensure proper file permissions

#### 5. **Nginx Configuration Errors**
```bash
# Test nginx configuration
docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine nginx -t

# Check nginx logs
docker-compose logs nginx
```

#### 6. **Service Not Starting**
```bash
# Check container status
docker-compose ps

# Check individual service logs
docker-compose logs -f nginx
docker-compose logs -f fastapi
docker-compose logs -f nextjs

# Restart specific service
docker-compose restart nginx
```

### Debug Mode

Run without detaching to see logs:
```bash
docker-compose up --build
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v --rmi all

# Remove all containers and images
docker system prune -a

# Rebuild from scratch
docker-compose up --build
```

## 🚀 Production Deployment

For production deployment, consider these enhancements:

### 🔒 Security
1. **SSL Certificates**: Use Let's Encrypt or your CA
2. **Environment Variables**: Use `.env` files for sensitive data
3. **Firewall Rules**: Configure proper firewall settings
4. **Regular Updates**: Keep all components updated

### 📊 Monitoring & Logging
1. **Log Rotation**: Configure log rotation for nginx logs
2. **Monitoring**: Add Prometheus/Grafana for metrics
3. **Alerting**: Set up alerts for service failures
4. **Health Checks**: Implement comprehensive health monitoring

### 💾 Data Management
1. **Database**: Use production-grade database (PostgreSQL/MySQL)
2. **Backup Strategy**: Regular database and file backups
3. **Redis**: Add Redis for caching and sessions
4. **File Storage**: Use cloud storage for uploads

### 🔧 Performance
1. **Load Balancing**: Multiple backend instances
2. **CDN**: Use CDN for static assets
3. **Caching**: Implement proper caching strategies
4. **Compression**: Enable gzip/brotli compression

### 📋 Deployment Checklist
- [ ] SSL certificates configured
- [ ] Environment variables set
- [ ] Database configured and backed up
- [ ] Monitoring tools installed
- [ ] Log rotation configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Health checks implemented

## 📁 File Structure

```
nginx/
├── 📄 nginx.conf              # Main Nginx configuration
├── 🐳 docker-compose.yml      # Docker services orchestration
├── 🚀 start_nginx.bat        # Windows start script
├── 🛑 stop_nginx.bat         # Windows stop script
├── 🧪 test_config.bat        # Configuration test script
├── 📖 README.md              # This documentation file
├── ⚙️ env.example            # Environment variables template
├── 📊 logs/                  # Nginx logs (created automatically)
├── 📁 static/                # Static files (created automatically)
└── 📤 uploads/               # File uploads (created automatically)
```

### 📋 Scripts Overview

| Script | Purpose |
|--------|---------|
| `start_nginx.bat` | Start all services with Docker Compose |
| `stop_nginx.bat` | Stop all services and clean up |
| `test_config.bat` | Test Nginx configuration syntax |

### 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `nginx.conf` | Main Nginx reverse proxy configuration |
| `docker-compose.yml` | Multi-service container orchestration |
| `env.example` | Environment variables template | 