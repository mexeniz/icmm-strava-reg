'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.createTable('intania_clubs', { 
                                                  id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, },
                                                  strava_id: Sequelize.STRING,
                                                  intania: Sequelize.INTEGER,
                                                  name: Sequelize.STRING
                                                });
      
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('intania_clubs');
  }
};
