# SmartHome Backend - Deployment Guide

## 🐳 Docker Deployment

The fastest way to get the backend running with database.

### Prerequisites
- Docker & Docker Compose installed

### Quick Start

1. **Start Services**
   ```bash
   docker-compose up -d
   ```

2. **Check Status**
   ```bash
   docker-compose ps
   ```

3. **View Logs**
   ```bash
   docker-compose logs -f backend
   ```

4. **Stop Services**
   ```bash
   docker-compose down
   ```

---

## 🌐 Manual Deployment

### Option 1: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL
# (manually or use docker)
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15

# 3. Create database
createdb -U postgres smarthome_db

# 4. Load schema
psql -U postgres -d smarthome_db -f database.sql

# 5. Configure .env
cp .env.example .env
# Edit .env with your settings

# 6. Start backend
npm run dev
```

### Option 2: Production Server

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone repository
git clone <your-repo> smarthome
cd smarthome

# 3. Install dependencies
npm install

# 4. Setup PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# 5. Create database and user
sudo -u postgres psql
CREATE DATABASE smarthome_db;
CREATE USER smarthome WITH PASSWORD 'secure_password';
ALTER ROLE smarthome GRANT CONNECT ON DATABASE smarthome_db TO smarthome;

# 6. Load schema
psql -U smarthome -d smarthome_db -f database.sql

# 7. Configure environment
cp .env.example .env
nano .env  # Edit settings

# 8. Start with PM2
npm install -g pm2
pm2 start server.js --name "smarthome-backend"
pm2 startup
pm2 save
```

### Option 3: Cloud Deployment (Heroku)

```bash
# 1. Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login to Heroku
heroku login

# 3. Create app
heroku create smarthome-backend

# 4. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 5. Set environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production

# 6. Deploy
git push heroku main

# 7. Run migrations
heroku run psql -f database.sql
```

---

## ⚙️ Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Use strong DB password
- [ ] Enable HTTPS
- [ ] Configure CORS for frontend domain
- [ ] Set up error logging (e.g., Sentry)
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure monitoring (e.g., New Relic)
- [ ] Use environment-specific .env files
- [ ] Test all API endpoints
- [ ] Verify database performance
- [ ] Set up CI/CD pipeline
- [ ] Configure automatic restarts (PM2 or systemd)

---

## 🔒 Security Considerations

1. **Secrets Management**
   - Use AWS Secrets Manager or HashiCorp Vault
   - Never commit .env to git
   - Use different secrets per environment

2. **Database**
   - Enable SSL connections
   - Use strong passwords
   - Regular backups
   - Monitor for unauthorized access

3. **API Security**
   - HTTPS only in production
   - Rate limiting
   - Input validation (already implemented)
   - CORS configuration
   - Request size limits

4. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)
   - Uptime monitoring
   - Log aggregation (ELK Stack)

---

## 📊 Scaling Considerations

### Horizontal Scaling
- Run multiple instances behind load balancer
- Use session/token-based auth (✓ already implemented)
- Cache frequently accessed data (Redis)
- Database connection pooling

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Database optimization
- Query indexing (✓ already implemented)
- Connection timeouts

### Performance
- Add Redis for caching
- Implement pagination
- Gzip compression
- CDN for static assets
- Database query optimization

---

## 🛠️ Maintenance

### Regular Tasks
- Monitor logs
- Update dependencies monthly
- Backup database daily
- Review security advisories
- Monitor server resources

### Troubleshooting
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs backend

# Restart service
docker-compose restart backend

# Connect to database
docker-compose exec postgres psql -U postgres -d smarthome_db

# Clear all data
docker-compose down -v
```

---

## 📈 Monitoring & Alerts

### Essential Metrics
- API response time
- Database query time
- Error rate
- CPU/Memory usage
- Database connections
- Request volume

### Alert Thresholds
- Response time > 2s
- Error rate > 1%
- CPU > 80%
- Memory > 85%
- Database connections > 90%

---

## 🚀 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy Backend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run build
      - uses: docker/build-push-action@v2
        with:
          push: true
          tags: my-registry/smarthome:latest
```

---

## 📝 Environment Variables for Production

```env
PORT=3000
NODE_ENV=production

DB_HOST=prod-db-instance.amazonaws.com
DB_PORT=5432
DB_NAME=smarthome_prod
DB_USER=smarthome_prod_user
DB_PASSWORD=<STRONG_PASSWORD>

JWT_SECRET=<STRONG_RANDOM_KEY_MIN_32_CHARS>
JWT_EXPIRE=7d

CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com

# Optional
LOG_LEVEL=info
SENTRY_DSN=https://key@sentry.io/project
REDIS_URL=redis://localhost:6379
```

---

## 🔗 Related Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [PostgreSQL Performance](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Docker Best Practices](https://docs.docker.com/develop/docker-compose/best-practices/)

---

## Support

For deployment issues:
1. Check the troubleshooting section
2. Review logs: `docker-compose logs`
3. Verify environment variables
4. Check database connectivity
5. Review API documentation

---

## Next Steps

1. Deploy to staging environment
2. Run full test suite
3. Perform load testing
4. Set up monitoring
5. Configure backups
6. Deploy to production

Good luck! 🚀
