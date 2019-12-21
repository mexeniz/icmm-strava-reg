// expensive function - call only once a day, during off peak
module.exports = {
  generateFoundationJSON: function() {
  	return new Promise(function(resolve, reject) {

  		const queryHelper = require('./queryHelper')

  		queryHelper.getFoundationList().then(function(foundations) {
			queryHelper.getAllFoundationUsers().then(function(allUsers) {
  				queryHelper.getEachUserSumActivities().then(function(eachUserSumActivities) {
  					
  					// structure mapping row->d3
  					// one level only
  					// foundation -> athlete

  					// prep foundation list
  					newData = {name:'ICMM 2020 Ranger Challenge', children:[]}
  					for(i in foundations) {
  						newFoundation = {name: foundations[i].name, children: []};

  						// fill foundation list
	  					allUsers.forEach(function(user) {

	  						if(user.registration.foundation_id == foundations[i].id) {

	  							userActivity = eachUserSumActivities.find(function(sumAct) {
	  								return sumAct.user_id == user.id;
		  						});

                  if(userActivity !== undefined) {
  		  						newEntry = {
  			  						 		name: user.first_name+' '+user.last_name, 
  			  								size: userActivity.total_distance,

  			  							};

  		  						newFoundation.children.push(newEntry);
                  }
                  
	  						}

	  					});

	  					newData.children.push(newFoundation)

  					}

  					
  					resolve(newData);
  				});
	  		});
  		});
  		
  		
  	});
  },
  generateIntaniaJSON: function() {
  	return new Promise(function(resolve, reject) {

  		const queryHelper = require('./queryHelper')

  		queryHelper.getIntaniaClubList().then(function(intanias) {
			queryHelper.getAllIntaniaUsers().then(function(allUsers) {
  				queryHelper.getEachUserSumActivities().then(function(eachUserSumActivities) {

  					// prep foundation list
  					newData = {name:'ICMM 2020 Intania', children:[]}
  					for(i in intanias) {
  						newIntania = {name: intanias[i].name, children: []};

  						// fill foundation list
	  					allUsers.forEach(function(user) {

	  						if(user.intania_clubs[0].intania == intanias[i].intania) {

	  							userActivity = eachUserSumActivities.find(function(sumAct) {
	  								return sumAct.user_id == user.id;
		  						})
 
                  if(userActivity !== undefined) {

  		  						newEntry = {
  			  						 		name: user.first_name+' '+user.last_name, 
  			  								size: userActivity.total_distance,

  			  							};

  		  						newIntania.children.push(newEntry);
                  }

	  						}

	  					});

	  					newData.children.push(newIntania)

  					}

  					
  					resolve(newData);
  				});
	  		});
  		});
  		
  		
  	});
  },
};