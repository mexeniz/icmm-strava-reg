const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize('strava', process.env.DB_USER, process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: false
        },
    });

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const users = db.users;
const intania_clubs = db.intania_clubs;
const activities = db.activities;
const registrations = db.registrations;

// Relation: users  - intania_clubs
users.belongsToMany(intania_clubs, {
    through: 'user_clubs',
    foreignKey: 'user_id',
    otherKey: 'club_id'
});
intania_clubs.belongsToMany(users, {
    through: 'user_clubs',
    foreignKey: 'club_id',
    otherKey: 'user_id'
});
// Relation: users - activities
users.hasMany(activities, {
    foreignKey: 'user_id'
});
activities.belongsTo(users, {
    foreignKey: 'user_id'
});
// Relation: users - rehistrations
registrations.belongsTo(users, {
    foreignKey: 'user_id'
});


module.exports = db;
