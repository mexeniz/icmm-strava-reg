'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.createTable('activities', { 
                                                  id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, },
                                                  strava_id: Sequelize.STRING,
                                                  user_id: Sequelize.BIGINT,
                                                  created_at: {
                                                                type: Sequelize.DATE, 
                                                                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                                                                allowNull: false
                                                              },
                                                  updated_at: {
                                                                type: Sequelize.DATE, 
                                                                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                                                                allowNull: false
                                                              },
                                                  deleted_at: {
                                                                type: Sequelize.DATE,
                                                                allowNull: true
                                                              },
                                                  name: Sequelize.STRING,
                                                  start_date: Sequelize.DATE,
                                                  start_date_local: Sequelize.DATE,
                                                  distance: Sequelize.BIGINT.UNSIGNED,
                                                  moving_time: Sequelize.BIGINT.UNSIGNED,
                                                  elapsed_time: Sequelize.BIGINT.UNSIGNED,
                                                  elev_high: Sequelize.DOUBLE,
                                                  elev_low: Sequelize.DOUBLE,
                                                  total_elevation_gain:  Sequelize.DOUBLE,
                                                  manual: Sequelize.BOOLEAN,
                                                  promo_comment: Sequelize.STRING,
                                                  promo_multiplier: Sequelize.STRING, 
                                                });
      
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('activities');
  }
};
