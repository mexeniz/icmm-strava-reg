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
            [models.sequelize.literal('sum(activities.distance * if(isnull(activities.promo_multiplier),1,activities.promo_multiplier))'), 'total_distance'],
            [models.sequelize.fn('count', models.sequelize.col('activities.strava_id')), 'total_activities']
          ]
          }
        ],
        group: ['users.id']
      });
};

module.exports.getAllUsers = function () {
    return models.users.findAll({
        where: {
        },
        include: [
          {
            model: models.registrations,
            include: [
              models.foundations
            ]
          },
        ],

      });
};
module.exports.getFoundationList = function () {
    return models.foundations.findAll({});
};
module.exports.getIntaniaClubList = function () {
    return models.intania_clubs.findAll({});
};
module.exports.getAllIntaniaUsers = function () {
    return models.users.findAll({
        where: {
        },
        include: [
          {
            model: models.intania_clubs,
          },
          {
            model: models.registrations,
            include: [
              models.foundations
            ]
          },
        ],

      }).filter(function(entry) {
        if(entry.intania_clubs != undefined && entry.intania_clubs.length != 0)
          return entry.intania_clubs[0].intania != null
      });
};
module.exports.getAllFoundationUsers = function () {
    return models.users.findAll({
        where: {

        },
        include: [
          {
            model: models.registrations,
            include: [
              models.foundations,
            ],
          },
         
        ],

      }).filter(function(entry) {
        const get = function(obj, key) {
            return key.split(".").reduce(function(o, x) {
                return (typeof o == "undefined" || o === null) ? o : o[x];
            }, obj);
        }
        return get(entry, 'registration.foundation_id') != null
      });
};
module.exports.getEachUserSumActivities = async function () {
    return await models.activities.findAll({
        where: {
        },
        attributes: [
          'user_id',
          [models.sequelize.literal('sum(activities.distance * if(isnull(activities.promo_multiplier),1,activities.promo_multiplier))'), 'total_distance'],
          [models.sequelize.fn('count', models.sequelize.col('activities.strava_id')), 'total_activities'],
        ],
        group: ['activities.user_id'],
        raw: true
      });
};