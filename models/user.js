module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        id: { type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },    
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        registration_id: DataTypes.BIGINT,
        strava_id: DataTypes.STRING,
    });
};
