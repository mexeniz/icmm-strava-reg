'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.createTable('credentials', { 
                                                  id: { type: Sequelize.BIGINT},
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
                                                  strava_client: { type: Sequelize.STRING, primaryKey: true },
                                                  strava_token: { type: Sequelize.STRING, primaryKey: true },
                                                  strava_code: Sequelize.STRING
                                                });
      
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('credentials');
  }
};

