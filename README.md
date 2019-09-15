# icmm-strava-reg
ICMM service registration with Strava account

## 1. Deployment

### 1.1 Configuration

#### 1.1.1 .env

Configure `CALL_BACK_URL`

```
STRAVA_CLIENT_ID=
STRAVA_CLIENT_SECRET=
BIND_ADDRESS=0.0.0.0
PORT=3000
# Any valid url that external users can access
CALL_BACK_URL=http://localhost:8090/auth/strava/callback
```

#### 1.1.2 docker-compose.yml

Configure `volumes` and `ports`

```
    volumes:
      - ./data:/data
    ports:
      - 8090:3000
```

### 1.2 Run App

```
docker-compose build --force-rm &&  docker-compose up --force-recreate
```