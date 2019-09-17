module.exports = (sequelize, DataTypes) => {
    return sequelize.define('registrations', {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        gender: DataTypes.STRING,
        phone_number: DataTypes.STRING,
        race_type: DataTypes.STRING,
        race_category: DataTypes.STRING,
        foundation_id: DataTypes.BIGINT,
    });
};
