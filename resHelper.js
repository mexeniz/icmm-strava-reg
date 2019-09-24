/**
 * @param user user queried from database
 * @param stravaProfile strava profile from req.user
 */
module.exports.makeUserData = function (user, stravaProfile) {
    var userData = {
        stravaProfile: stravaProfile,
        user: {}
    };
    // Check if user joined intania clubs
    if (user.intania_clubs && user.intania_clubs[0].length != 0){
        userData.user['intania'] = user.intania_clubs[0].intania;
    } else {
        userData.user['intania'] = null;
    }
    // Check if user registered with ICMM registration info.
    if (user.registration){
        var registration = user.registration;
        userData.user['registration'] = {
            firstName: registration.first_name,
            lastName: registration.last_name,
            raceType: registration.race_type,
            raceCategory: registration.race_category,
        };
        var foundation = user.registration.foundation;
        userData.user['foundation'] = {
            name: foundation.name
        }
    }else{
        userData['registration'] = null;
        userData['foundation'] = null
    }

    if (user.activities && user.activities[0].length != 0){
        userData.user['totalDistance'] = parseInt(user.activities[0].dataValues.total_distance);
        userData.user['totalActivities'] = parseInt(user.activities[0].dataValues.totalActivities);
    } else {
        userData.user['totalDistance'] = 0;
        userData.user['totalActivities'] = 0;
    }

    userData.user['firstName'] = user.first_name;
    userData.user['lastName'] = user.last_name;

    console.log(`userData: ${JSON.stringify(userData)}`);
    return userData;
};