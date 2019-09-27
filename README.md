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

#### 1.1.3 Database Migration

Create empty MySQL database name `strava`
```
    CREATE DATABASE strava CHARACTER SET utf8 COLLATE utf8_unicode_ci;
```

Install Sequelize-cli
```
    npm install -g sequelize-cli
```

Edit Sequalize DB configuration in `config/config.json` (development section, or other)
Then, run database migration
```
    sequelize db:migrate
```

If error occurs, undo and fix migration files [Sequelize Migrations](https://sequelize.org/master/manual/migrations.html) before re-migrating
```
    sequelize db:migrate:undo:all
```

#### 1.1.3 Database Seeding

To add mandatory data
```
    sequelize db:seed --seed 20190924165548-mandatory-data
```

To add test data
```
    sequelize db:seed --seed 20190924165554-test-data
```

To undo test data
```
    sequelize db:seed:undo --seed 20190924165554-test-data
```

### 1.2 Run App

```
docker-compose build --force-rm &&  docker-compose up --force-recreate
```