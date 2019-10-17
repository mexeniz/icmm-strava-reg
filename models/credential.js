module.exports = (sequelize, DataTypes) => {
    return sequelize.define('credentials', {
        id: DataTypes.BIGINT,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE,
        strava_client: { type: DataTypes.STRING, primaryKey: true },
        strava_token: { type: DataTypes.STRING, primaryKey: true },
        strava_code: DataTypes.STRING,
        user_id: DataTypes.BIGINT,
    });
};
