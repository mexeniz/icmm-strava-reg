'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.createTable('user_clubs', { 
                                                  user_id: { type: Sequelize.BIGINT, primaryKey: true },
                                                  club_id: { type: Sequelize.STRING, primaryKey: true },
                                                });
      
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_clubs');
  }
};
