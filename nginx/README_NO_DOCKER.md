# AuraSync without Docker

This guide shows how to run AuraSync without Docker, using direct installation of services.

## 🚀 Quick Start (No Docker)

### Prerequisites

1. **Python 3.11+** - [Download from python.org](https://python.org)
2. **Node.js 18+** - [Download from nodejs.org](https://nodejs.org)
3. **Nginx** - [Download from nginx.org](https://nginx.org)

### Installation Steps

#### 1. Install Python Dependencies
```bash
cd final/backend
pip install -r requirements.txt
```

#### 2. Install Node.js Dependencies
```bash
cd final/aurasync/aurasync-13
npm install
```

#### 3. Install Nginx
- **Windows**: Download from nginx.org and extract
- **Linux**: `sudo apt-get install nginx`
- **macOS**: `brew install nginx`

### Starting Services

#### Option 1: Manual Start (3 Terminal Windows)

**Terminal 1 - FastAPI Backend:**
```bash
cd final/backend
python main.py
```

**Terminal 2 - Next.js Frontend:**
```bash
cd final/aurasync/aurasync-13
npm run dev
```

**Terminal 3 - Nginx:**
```bash
cd final/nginx
nginx -c nginx_standalone.conf
```

#### Option 2: Using Scripts

Run the provided script:
```bash
cd final/nginx
start_without_docker.bat
```

### Access Points

- **Frontend**: http://localhost
- **API Docs**: http://localhost/docs
- **Health Check**: http://localhost/health

## 🔧 Configuration

### Nginx Configuration
Use `nginx_standalone.conf` instead of `nginx.conf`:
- Points to localhost services
- No Docker-specific settings
- Same features as Docker version

### Environment Setup
Make sure all services can access:
- Port 80 (Nginx)
- Port 8000 (FastAPI)
- Port 3000 (Next.js)

## 📊 Monitoring

### Check Services
```bash
# Check if services are running
netstat -ano | findstr :80
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Check Nginx status
nginx -t
nginx -s reload
```

### View Logs
```bash
# Nginx logs (location depends on installation)
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# FastAPI logs (in terminal where it's running)
# Next.js logs (in terminal where it's running)
```

## 🔧 Troubleshooting

### Common Issues

#### 1. **Port Conflicts**
```bash
# Check what's using ports
netstat -ano | findstr :80
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Kill processes if needed
taskkill /PID <PID> /F
```

#### 2. **Python Dependencies**
```bash
# Reinstall requirements
pip install -r requirements.txt --force-reinstall
```

#### 3. **Node.js Dependencies**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 4. **Nginx Issues**
```bash
# Test configuration
nginx -t

# Reload configuration
nginx -s reload

# Stop Nginx
nginx -s stop
```

## ✅ Advantages of No Docker

- **No Docker installation required**
- **Faster startup** (no container building)
- **Direct access** to files and logs
- **Easier debugging** with direct terminal access
- **Lower resource usage**

## ❌ Disadvantages of No Docker

- **Manual setup** for each environment
- **Dependency conflicts** possible
- **Inconsistent environments** across machines
- **Harder to deploy** to production
- **More maintenance** required

## 🚀 Production Considerations

For production without Docker:

1. **Use systemd services** (Linux) or Windows services
2. **Configure proper logging** and log rotation
3. **Set up monitoring** tools
4. **Use process managers** like PM2 for Node.js
5. **Configure SSL certificates** directly in Nginx

## 📋 Comparison

| Feature | With Docker | Without Docker |
|---------|-------------|----------------|
| Setup Time | 5 minutes | 15-30 minutes |
| Consistency | ✅ High | ❌ Variable |
| Portability | ✅ High | ❌ Low |
| Resource Usage | Medium | Low |
| Debugging | Container logs | Direct terminal |
| Production Ready | ✅ Yes | ⚠️ Requires setup | 