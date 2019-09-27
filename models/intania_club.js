module.exports = (sequelize, DataTypes) => {
    return sequelize.define('intania_clubs', {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        strava_id: DataTypes.STRING,
        intania: DataTypes.BIGINT,
        name: DataTypes.STRING
    });
};