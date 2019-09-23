const models = require('./models')

module.exports.getOneUserByStravaId = function (strava_id) {
    return models.users.findAll({
        limit: 1,
        where: {
          strava_id: strava_id,
        },
        include: [
          models.intania_clubs,
          {
            model: models.registrations,
            include: [
              models.foundations
            ]
          },
          {
            model: models.activities,
            attributes: [
            [models.sequelize.fn('sum', models.sequelize.col('activities.distance')), 'total_distance'],
            [models.sequelize.fn('count', models.sequelize.col('activities.strava_id')), 'total_activities']
          ]
          }
        ],
        group: ['users.id']
      });
};