module.exports = (sequelize, DataTypes) => {
    return sequelize.define('activities', {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        strava_id: DataTypes.BIGINT,
        user_id: DataTypes.BIGINT,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE,
        name: DataTypes.STRING,
        start_date: DataTypes.DATE,
        start_date_local: DataTypes.DATE,
        distance: DataTypes.BIGINT.UNSIGNED,
        moving_time: DataTypes.BIGINT.UNSIGNED,
        elapsed_time: DataTypes.BIGINT.UNSIGNED,
        elev_high: DataTypes.DOUBLE,
        elev_low: DataTypes.DOUBLE,
        total_elevation_gain:  DataTypes.DOUBLE,
        manual: DataTypes.BOOLEAN,
        promo_comment: DataTypes.STRING,
        promo_multiplier: DataTypes.STRING,
    });
};
