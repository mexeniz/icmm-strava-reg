module.exports = (sequelize, DataTypes) => {
    return sequelize.define('foundations', {
        id: { type: DataTypes.BIGINT, primaryKey: true },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        deleted_at: DataTypes.DATE,
        name: DataTypes.STRING,
    });
};
