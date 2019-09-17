module.exports = (sequelize, DataTypes) => {
    return sequelize.define('credentials', {
        id: DataTypes.BIGINT,
        strava_client: { type: DataTypes.BIGINT, primaryKey: true },
        strava_token: { type: DataTypes.STRING, primaryKey: true },
        strava_code: DataTypes.STRING
    });
};
