angular.module('starter.services', [])


.factory('ParseSvc', ['$http', function($http) {

  Parse.serverURL = 'https://parseapi.back4app.com';
  var isRegistered;
  var user = Parse.User.current();
  if (user) {
    isRegistered = true;
    // do stuff with the user
  } else {
    isRegistered = false;
    user = new Parse.User();
  }

  return {
    isRegistered: isRegistered,
    getUsername: function() {
      return user.get('username');
    },
    getUserId: function() {
      return user.id;
    },
    login: function(_user, successCallback) {
      Parse.User.logIn(_user.username, _user.password, {
        success: function(_user) {
          user = _user;
          console.log(user.get('username'));
          // Do stuff after successful login.
          alert('Logged in as ' + user.get('username'));
          successCallback();
        },
        error: function(user, error) {
          // The login failed. Check error to see why
          console.log("Error: " + error.code + " " + error.message);
          alert('Login failed');
        }
      });
    },
    signUp: function(_user, successCallback) {
      user = new Parse.User();
      user.set("username", _user.username.toLowerCase());
      user.set("email", _user.email);
      user.set("password", _user.password);
      user.set("firstName", _user.firstName);
      user.set("lastName", _user.lastName);
      user.signUp(null, {
        success: function(user) {
          // Hooray! Let them use the app now.
          alert('Signed up successfully')
          successCallback();
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert('There was an error. See the log to ge the message')
            console.log("Error: " + error.code + " " + error.message);
        }
      });
    },
    resetPassword: function(email) {
      Parse.User.requestPasswordReset(email, {
        success: function() {
          // Password reset request was sent successfully
          alert("password reset link sent")
        },
        error: function(error) {
          // Show the error message somewhere
          alert("Error: " + error.code + " " + error.message);
        }
      });
    },
    logout: function(sucessCallback) {
      Parse.User.logOut();
      console.log('logged out');
      alert('logged out');

      var currentUser = Parse.User.current(); 
      user = Parse.User.current(); 
      isRegistered = false;
      sucessCallback();


    },
    getUsers: function(sucessCallback) {
      var user_query = new Parse.Query(Parse.User);
      user_query.select("username", "email");
      user_query.find().then(function(results) {
        sucessCallback(results);
      });
    },
    getDruglist: function(ownerId,sucessCallback) {
      var drug = Parse.Object.extend("Druglist");
      var druglist_query = new Parse.Query(drug);
      druglist_query.select("owner","description","drugname","objectId","start_date","end_date","Mon","Tu","Wed","Thu","Fri","Sat","Sun","start_date","end_date","morning","noon","night");
      druglist_query.equalTo("owner",ownerId);
      druglist_query.find().then(function(results) {
        sucessCallback(results);
       });
    },
    addReport:function(_report,successCallback)
    {
      console.log("I am here");
      var Report = Parse.Object.extend("Report");
      var report = new Report();
      report.set("drugname",_report.drugname);
      report.set("owner",_report.owner);
      report.set("date_time",_report.date_time);
      report.set("geo",_report.geo);
      report.save(null, {
        success: function(meeting) {
          successCallback();
        },
        error: function(error) {
          // Show the error message somewhere and let the user try again.
          alert('There was an error with adding a drug. See the log to get the message')
            console.log("Error: " + error.code + " " + error.message);
        }
      });
    },
    addDrug: function(_drug, successCallback) {
      var Drug = Parse.Object.extend("Druglist");
      var drug = new Drug();
      drug.set("drugname",_drug.drugname);
      drug.set("description",_drug.description);
      drug.set("owner",_drug.owner);
      drug.set("start_date",_drug.start_date);
      drug.set("end_date",_drug.end_date);
      drug.set("morning",_drug.morning);
      drug.set("noon",_drug.noon);
      drug.set("night",_drug.night);
      drug.set("Mon",_drug.Mon);
      drug.set("Tu",_drug.Tu);
      drug.set("Wed",_drug.Wed);
      drug.set("Thu",_drug.Thu);
      drug.set("Fri",_drug.Fri);
      drug.set("Sat",_drug.Sat);
      drug.set("Sun",_drug.Sun);
      drug.save(null, {
        success: function(meeting) {
          successCallback();
        },
        error: function(error) {
          // Show the error message somewhere and let the user try again.
          alert('There was an error with adding a drug. See the log to get the message')
            console.log("Error: " + error.code + " " + error.message);
        }
      });
    },
    deleteDrug: function(_drug) {
      var query = new Parse.Query("Druglist");
      console.log(_drug.objectId);
      query.equalTo("objectId",_drug.objectId);
      query.find().then(function(results) {
        return Parse.Object.destroyAll(results);
      }).then(function() {
        //done
      }, function(error) {
    // Error
      });
    },
    appOpened: function() {
      $http({
        method: 'POST',
        url: 'https://parseapi.back4app.com/1/events/AppOpened',
        headers: {
          'X-Parse-Application-Id': "9gVPgmfhQbcvkd5jwXdtuCmIjqXLiAFWkfBGPu9s", 
          'X-Parse-REST-API-Key': "kyhaSMYNAGSslxKpiikk4BShk0GjkffpUTUrOp7P",
          'Content-Type': "application/json"
        },
        data: {}
      });
    },



  };
}]);
