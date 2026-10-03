# Production Deployment Guide — Sherpur Eye Hospital

## Pre-deployment Checklist

### Secrets (CRITICAL — do before anything else)
```bash
# Generate JWT secret (64 bytes)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate cookie secret (32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set in backend `.env`:
```
NODE_ENV=production
JWT_SECRET=<64-char-hex>
COOKIE_SECRET=<32-char-hex>
DATABASE_URL=postgresql://USER:PASS@HOST:5432/sherpur_eye_hospital?sslmode=require
FRONTEND_URL=https://yourdomain.com
```

### Backend
```bash
cd backend
npm install --production
npx prisma migrate deploy   # apply all migrations
npx prisma generate         # regenerate client
npm run build               # compile TypeScript
npm start                   # runs dist/index.js
```

### Frontend
```bash
cd frontend
# Set .env.local:
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
npm install
npm run build
npm start
```

---

## Database Backup Strategy

### Automated daily backups (pg_dump)
```bash
# /etc/cron.d/hospital-backup
0 2 * * * postgres pg_dump -Fc sherpur_eye_hospital > /backups/hospital_$(date +\%Y\%m\%d).dump
# Keep 30 days
find /backups -name "*.dump" -mtime +30 -delete
```

### Restore from backup
```bash
pg_restore -d sherpur_eye_hospital /backups/hospital_YYYYMMDD.dump
```

### Offsite backup
- Copy daily dumps to S3/Cloudflare R2:
```bash
aws s3 cp /backups/hospital_$(date +%Y%m%d).dump s3://your-bucket/db-backups/
```

### Point-in-time recovery
Enable WAL archiving in `postgresql.conf`:
```
wal_level = replica
archive_mode = on
archive_command = 'cp %p /wal_archive/%f'
```

---

## Security Hardening

### Nginx reverse proxy (recommended)
```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # Rate limit at nginx level too
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass         http://localhost:5000;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   Host $host;
        proxy_hide_header  X-Powered-By;
    }
}
```

### Process manager (PM2)
```bash
npm install -g pm2
pm2 start dist/index.js --name hospital-api --max-memory-restart 512M
pm2 save
pm2 startup
```

### PostgreSQL hardening
```sql
-- Create a dedicated app user with minimal privileges
CREATE USER hospital_app WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE sherpur_eye_hospital TO hospital_app;
GRANT USAGE ON SCHEMA public TO hospital_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hospital_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO hospital_app;
-- Revoke superuser from app connection
```

---

## Monitoring

### Health check endpoint
```
GET /api/v1/health
→ { "status": "ok", "timestamp": "..." }
```

### Log rotation
```bash
# /etc/logrotate.d/hospital
/var/log/hospital/*.log {
    daily
    rotate 14
    compress
    missingok
    notifempty
}
```

### Uptime monitoring
- Use UptimeRobot or Better Uptime to ping `/api/v1/health` every 5 minutes
- Alert on 2 consecutive failures

---

## Patient Data Privacy (HIPAA-equivalent)

- All patient data is stored in PostgreSQL with no external replication
- Cloudinary images are stored under a private folder — set delivery type to `authenticated` for patient photos
- Audit logs capture all access to patient records
- Database connection uses SSL (`sslmode=require`) in production
- Backups are encrypted at rest on S3 using SSE-S3
- Staff access is role-based — doctors only see their own patients via clinic routes
- Passwords are hashed with bcrypt (cost factor 12)
- Sessions expire after 7 days; accounts lock after 5 failed attempts
