'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.createTable('users', { 
                                                  id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, },
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
                                                  first_name: Sequelize.STRING,
                                                  last_name: Sequelize.STRING,
                                                  registration_id: Sequelize.BIGINT,
                                                  strava_id: Sequelize.STRING,
                                                });
      
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
