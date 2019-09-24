'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
        {registration_id: 1, first_name: 'Seehait', last_name: 'Chockthanyawat', strava_id: 36994444},
        {registration_id: 21,first_name: 'Pawissakan', last_name: 'Chirupphapa', strava_id: 24918536},
        {registration_id: null,first_name: 'Ponlawat (OAK83)', last_name: 'Tantivongampai', strava_id: 7302049},
        {registration_id: null,first_name: 'Theeradej', last_name: 'H.', strava_id: 6096561},
        {registration_id: null,first_name: 'Worawitchayawit', last_name: 'Prasoetying', strava_id: 46777823},

      ], {}).then(function() {
          queryInterface.bulkInsert('registrations', [
            {first_name:'f', last_name:'l', gender:'m',phone_number:'22222222', race_type: 'a', race_category:'c', foundation_id:1,  registration_id: 'NULL'},
            {first_name:'m', last_name:'c', gender:'m',phone_number:'4899', race_type: '10K', race_category:'25-29', foundation_id:1,  registration_id: 'abc123'},
            {first_name:'blue1', last_name:'blue1', gender:'m',phone_number:'5555', race_type: '10K', race_category:'25-29', foundation_id:1,  registration_id: 'blue1'},
            {first_name:'blue2', last_name:'blue2', gender:'m',phone_number:'5555', race_type: '10K', race_category:'25-29', foundation_id:1,  registration_id: 'blue2'},
            {first_name:'green1', last_name:'green1', gender:'m',phone_number:'5555', race_type: '10K', race_category:'25-29', foundation_id:2,  registration_id: 'green1'},
            {first_name:'green2', last_name:'green2', gender:'m',phone_number:'5555', race_type: '10K', race_category:'25-29', foundation_id:2,  registration_id: 'green2'},
            {first_name:'yellow1', last_name:'yellow1', gender:'m',phone_number:'5555', race_type: '10K', race_category:'25-29', foundation_id:3,  registration_id: 'yellow1'},
            {first_name:'yellow2', last_name:'yellow2', gender:'m',phone_number:'5555', race_type: '10K', race_category:'25-29', foundation_id:3,  registration_id: 'yellow2'},
            {first_name:'orange1', last_name:'orange1', gender:'m',phone_number:'5555', race_type: '10K', race_category:'25-29', foundation_id:4,  registration_id: 'orange1'},
            {first_name:'orange2', last_name:'orange2', gender:'m',phone_number:'5555', race_type: '10K', race_category:'25-29', foundation_id:4,  registration_id: 'orange2'},
            {first_name:'red1', last_name:'red1', gender:'m',phone_number:'5555', race_type: '10K', race_category:'25-29', foundation_id:5,  registration_id: 'red1'},
            {first_name:'red2', last_name:'red2', gender:'m',phone_number:'5555', race_type: '10K', race_category:'25-29', foundation_id:5,  registration_id: 'red2'},

        ], {})
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('registrations', null, {truncate: true}).then(function() {
      queryInterface.bulkDelete('users', null, {truncate: true})
    });
  }
};
