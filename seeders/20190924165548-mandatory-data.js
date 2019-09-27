'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('foundations', [
        {name: 'blue'}, 
        {name: 'green'},
        {name: 'yellow'},
        {name: 'orange'},
        {name: 'red'},
      ], {}).then(function() {
          queryInterface.bulkInsert('intania_clubs', [
            {strava_id:481819, intania:59, name:'Intania 59'},
            {strava_id:481656, intania:61, name:'Intania 61'},
            {strava_id:481932, intania:62, name:'Intania 62'},
            {strava_id:482772, intania:63, name:'Intania 63'},
            {strava_id:481757, intania:64, name:'Intania 64'},
            {strava_id:481652, intania:65, name:'Intania 65'},
            {strava_id:481992, intania:66, name:'Intania 66'},
            {strava_id:481924, intania:67, name:'Intania 67'},
            {strava_id:481643, intania:68, name:'Intania 68'},
            {strava_id:481840, intania:69, name:'Intania 69'},
            {strava_id:184771, intania:70, name:'Intania 70'},
            {strava_id:481856, intania:71, name:'Intania 71'},
            {strava_id:204302, intania:72, name:'Intania 72'},
            {strava_id:481635, intania:73, name:'Intania 73'},
            {strava_id:481641, intania:74, name:'Intania 74'},
            {strava_id:481856, intania:75, name:'Intania 75'},
            {strava_id:482289, intania:76, name:'Intania 76'},
            {strava_id:481649, intania:77, name:'Intania 77'},
            {strava_id:482125, intania:78, name:'Intania 78'},
            {strava_id:481622, intania:79, name:'Intania 79'},
            {strava_id:481657, intania:80, name:'Intania 80'},
            {strava_id:481673, intania:81, name:'Intania 81'},
            {strava_id:481781, intania:82, name:'Intania 82'},
            {strava_id:182013, intania:83, name:'Intania 83'},
            {strava_id:481618, intania:84, name:'Intania 84'},
            {strava_id:481619, intania:85, name:'Intania 85'},
            {strava_id:481592, intania:86, name:'Intania 86'},
            {strava_id:481692, intania:87, name:'Intania 87'},
            {strava_id:481756, intania:88, name:'Intania 88'},
            {strava_id:481594, intania:89, name:'Intania 89'},
            {strava_id:481777, intania:90, name:'Intania 90'},
            {strava_id:329648, intania:91, name:'Intania 91'},
            {strava_id:482556, intania:92, name:'Intania 92'},
            {strava_id:482791, intania:93, name:'Intania 93'},
            {strava_id:481624, intania:94, name:'Intania 94'},
            {strava_id:481863, intania:95, name:'Intania 95'},
            {strava_id:481779, intania:96, name:'Intania 96'},
            {strava_id:481832, intania:97, name:'Intania 97'},
            {strava_id:481759, intania:98, name:'Intania 98'},
        ], {})
      });
  },

  down: (queryInterface, Sequelize) => {
    
     
    return queryInterface.bulkDelete('foundations', null, {truncate: true}).then(function() {
      queryInterface.bulkDelete('intania_clubs', null, {truncate: true})
    });
    
  }
};
