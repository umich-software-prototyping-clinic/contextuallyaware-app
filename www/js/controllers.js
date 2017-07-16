angular.module('starter.controllers', ['ui.calendar'])


.controller('main', ['$scope', '$rootScope', 'ParseSvc', 'uiCalendarConfig', function($scope, $rootScope, ParseSvc, uiCalendarConfig){
  //for the calendar
  $scope.SelectedEvent = null;
  var isFirsttime = true;
  $scope.events = [];
  $scope.eventSources = [$scope.events];

  //function to generate all the day of week between two dates
  $scope.populate_week_range_options = function(day_of_week,start_date,end_date){
    var start = moment(start_date), // Sept. 1st
    end   = moment(end_date), // Nov. 2nd
    day   = day_of_week;                    // Sunday

    var result = [];
    var current = start.clone();

    while (current.day(7 + day).isBefore(end)) {
      result.push(current.clone());
    }

    return(result.map(m => m.format('YYYY-MM-DD')));
  };

  $scope.add_event = function(time,event_sample,old_start_date){
    var morning =  new Date(time);
    morning_time = (morning.toTimeString()).substring(0,8);

    var end_time = null;
    morning.setHours(morning.getHours()+1);
    var end_time = (morning.toTimeString()).substring(0,8);

    var start_date_time =  old_start_date.concat(" ").concat(morning_time);
    var end_date_time = old_start_date.concat(" ").concat(end_time);
    event_sample.start = start_date_time;
    event_sample.end = end_date_time;
    return(event_sample);
  };

  $scope.recur_days = function(result)
  {
    var recur_days_list = [false,false,false,false,false,false,false];
    recur_days_list[0] = result.get("Sun");
    recur_days_list[1] = result.get("Mon");
    recur_days_list[2] = result.get("Tu");
    recur_days_list[3] = result.get("Wed");
    recur_days_list[4] = result.get("Thu");
    recur_days_list[5] = result.get("Fri");
    recur_days_list[6] = result.get("Sat");
    return(recur_days_list);

  };

  $scope.sucessCallback = function(results) {
    $scope.events.slice(0,$scope.events.length);
    for (i = 0; i < results.length; ++i) {
      var recur_days_list = $scope.recur_days(results[i]);
      var buffer = new Date(results[i].get("start_date"));
      var old_start_date = buffer.toISOString().substring(0,10);
      buffer = new Date(results[i].get("end_date"));
      var old_end_date = buffer.toISOString().substring(0,10);

      //This function will create all the dates that are recurring between beginning and end dates
      var recur_dates = [];
      for(j =0; j < 7;j++)
      {
        if(recur_days_list[j])
        {
          var temp = $scope.populate_week_range_options(j,old_start_date,old_end_date);
          recur_dates = recur_dates.concat(temp);
        }
      }

      if(results[i].get("morning") != null)
       {
          var event_sample = {
            id: -1,
            title: results[i].get("drugname"),
            description: results[i].get("description"),
            start: old_start_date,
            end: old_start_date,
            stick:true
          };
          var time = results[i].get("morning");

          event_sample.title = event_sample.title.concat(" ").concat("morning");

          $scope.events.push($scope.add_event(time,event_sample,old_start_date));
          for(k = 0 ; k< recur_dates.length;k++)
              {
                var event_temp = jQuery.extend(true, {}, event_sample);
                event_temp = $scope.add_event(time,event_temp,recur_dates[k]);
                $scope.events.push(event_temp);
              } 
       }
      if(results[i].get("noon") != null)
       {

          var event_sample = {
            id: -1,
            title: results[i].get("drugname"),
            description: results[i].get("description"),
            start: old_start_date,
            end: old_start_date,
            stick:true
          };
          var time = results[i].get("noon");

          event_sample.title = event_sample.title.concat(" ").concat("noon");
          $scope.events.push($scope.add_event(time,event_sample,old_start_date));
          for(k = 0 ; k< recur_dates.length;k++)
              {
                var event_temp = jQuery.extend(true, {}, event_sample);
                var event_temp = $scope.add_event(time,event_temp,recur_dates[k]);
                $scope.events.push(event_temp);
              }          
       }
       if(results[i].get("night") != null)
       {
          var event_sample = {
            id: -1,
            title: results[i].get("drugname"),
            description: results[i].get("description"),
            start: old_start_date,
            end: old_start_date,
            stick:true
          };
          var time = results[i].get("night");
          event_sample.title = event_sample.title.concat(" ").concat("night");
          $scope.events.push($scope.add_event(time,event_sample,old_start_date));
          for(k = 0 ; k< recur_dates.length;k++)
              {
                var event_temp = jQuery.extend(true, {}, event_sample);
                var event_temp = $scope.add_event(time,event_temp,recur_dates[k]);
                $scope.events.push(event_temp);
              }          
       }
       for(m= 0; m < $scope.events.length;m++)
       {
          $scope.events[m].id = m;
       }

    }
   $scope.$apply();
   };



   ParseSvc.getDruglist(ParseSvc.getUserId(),$scope.sucessCallback);



   $scope.successcallback_report = function(){
      console.log("successadd drug");
   };

   //This function will record the data when drug is taken
   $scope.drugtaken = function(id){
      var date = new Date($scope.events[id].start);
      $scope.report = {
        drugname: $scope.events[id].title,
        owner: ParseSvc.getUserId(),
        date_time: date,
        geo: null
      }
    var onSuccess = function(position) {
      // // The following code can show your everything about the geo location 
        // alert('Latitude: '          + position.coords.latitude          + '\n' +
        //       'Longitude: '         + position.coords.longitude         + '\n' +
        //       'Altitude: '          + position.coords.altitude          + '\n' +
        //       'Accuracy: '          + position.coords.accuracy          + '\n' +
        //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        //       'Heading: '           + position.coords.heading           + '\n' +
        //       'Speed: '             + position.coords.speed             + '\n' +
        //       'Timestamp: '         + position.timestamp                + '\n');
        var geopoint = new Parse.GeoPoint(position.coords.latitude,position.coords.longitude); 
        $scope.report.geo = geopoint;
        console.log(geopoint);
        console.log($scope.report);
        ParseSvc.addReport($scope.report,$scope.successcallback_report);

    };

    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

  };

  $scope.uiConfig= {
    calendar:{
        height:380,
        editable:true,
        displayEventTime: false,
        header: {
                left: 'month,basicWeek,agendaDay',
                center: 'title',
                right:'today prev,next'
            },
        eventClick: function(event){
          $scope.SelectedEvent = event;
        },
        eventAfterAllRender: function(){
          if($scope.events.length > 0 && isFirsttime){
            uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate',$scope.events[0].start);
            isFirsttime = false;
          }
        }
    }
  };

}])

.controller('userlist', ['$scope', 'ParseSvc', function($scope, ParseSvc){

  $scope.users = [];
  $scope.sucessCallback = function(results) {
    for (i = 0; i < results.length; ++i) {
      $scope.users.push({
        username: results[i].getUsername(),
        email: results[i].getEmail()
      });
    } 
    $scope.$apply();
    console.log($scope.users);
  };
  ParseSvc.getUsers($scope.sucessCallback);
}])

.controller('login', ['$scope', '$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
  //callback function to set global username on login sucess
  //This is neccessary because JavaScript runs sychronously
  //callback functions are one way to preserve asynchronicity

  var loginCallback = function () {
    $rootScope.$broadcast('new username', ParseSvc.getUsername());
  }
  $scope.user = {
    username: null,
    password: null,
  };
  if(ParseSvc.isRegistered) {
    $rootScope.username = ParseSvc.getUsername();
  }
  $scope.login = function () {
    ParseSvc.login($scope.user, loginCallback)
  }
}])

.controller('signUp', ['$scope','$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
  var signupCallback = function () {
    $rootScope.$broadcast('new username', ParseSvc.getUsername());
  }
  $scope.user = {
    username: null,
    password: null,
    password2: null,
    email: null,
    name: null
  };
  if(ParseSvc.isRegistered) {
    $rootScope.username = ParseSvc.getUsername();
  }
  $scope.signUp = function () {
    if ($scope.user.password !== $scope.user.password2) {
      alert('Passwords don\'t match');
      return;
    }
    ParseSvc.signUp($scope.user, signupCallback);
  }
}])

.controller('reset', ['$scope','ParseSvc', function($scope, ParseSvc){
  $scope.email = null;
  $scope.resetPassword = function () {
    ParseSvc.resetPassword($scope.email)
  }
}])

.controller('logout', ['$scope','$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
  var logoutCallback = function() {
    $rootScope.$broadcast('new username', "");
  }
  $scope.logout = function () {
    ParseSvc.logout(logoutCallback);  
  }
}])

.controller('druglist', ['$scope', 'ParseSvc', function($scope, ParseSvc){
  $scope.Druglist = [];
 $scope.listCanSwipe = true;
  $scope.sucessCallback = function(results) {
    console.log(results);
    $scope.Druglist=[];
    for (i = 0; i < results.length; ++i) {
      $scope.Druglist.push({
        drugname: results[i].get("drugname"),
        objectId: results[i]["id"],
        owner: results[i].get("owner")
      });
    } 
    $scope.$apply();
    console.log($scope.Druglist);
    $scope.$broadcast('scroll.refreshComplete');
  };
  $scope.doRefresh = function() {
      ParseSvc.getDruglist(ParseSvc.getUserId(),$scope.sucessCallback);
  };
  $scope.deleteDrug = function(drug)
  {
    for(i = 0; i < this.Druglist.length;i++)
    {
      if(this.Druglist[i] == drug)
      {
        this.Druglist.splice(i,1);
      }
    }
    ParseSvc.deleteDrug(drug);
  };



  ParseSvc.getDruglist(ParseSvc.getUserId(),$scope.sucessCallback);
}])

.controller('addDrug', ['$scope','$state','$rootScope','ParseSvc', function($scope, $state, $rootScope, ParseSvc){
  var addDrugCallback = function () {
    //$rootScope.$broadcast('new username', ParseSvc.getUsername());
    alert("drug added successfully!");
    $state.go('druglist');
  }
  $scope.drug = {
    drugname: null,
    description: null,
    owner: ParseSvc.getUserId(),
    start_date: null,
    end_date: null,
    morning: null,
    noon: null,
    night: null,
    Mon: false,
    Tu: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false
  };
  console.log($scope.drug.owner);
  if(ParseSvc.isRegistered) {
    $rootScope.username = ParseSvc.getUsername();
  }
  $scope.addDrug = function () {
    ParseSvc.addDrug($scope.drug, addDrugCallback);
  }
  $scope.buttontype = {
    Mon: "button",
    Tu: "button",
    Wed: "button",
    Thu: "button",
    Fri: "button",
    Sat: "button",
    Sun: "button"
  }
  $scope.repeat = function(day)
  {

    if(day == 1)
    {
      if($scope.buttontype.Mon == "button")
      {
        $scope.buttontype.Mon = "button button-assertive";
        $scope.drug.Mon = true;
      }
      else
      {
        $scope.buttontype.Mon = "button"; 
        $scope.drug.Mon = false;
      }
    }
    else if(day == 2)
    {
      if($scope.buttontype.Tu == "button")
      {
        $scope.buttontype.Tu = "button button-assertive";
        $scope.drug.Tu = true;
      }
      else
      {
        $scope.buttontype.Tu = "button"; 
        $scope.drug.Tu = false;
      }
    }
    else if(day == 3)
    {
      if($scope.buttontype.Wed == "button")
      {
        $scope.buttontype.Wed = "button button-assertive";
        $scope.drug.Wed = true;
      }
      else
      {
        $scope.buttontype.Wed = "button"; 
        $scope.drug.Wed = false;
      }
    }
    else if(day == 4)
    {
      if($scope.buttontype.Thu == "button")
      {
        $scope.buttontype.Thu = "button button-assertive";
        $scope.drug.Thu = true;
      }
      else
      {
        $scope.buttontype.Thu = "button"; 
        $scope.drug.Thu = false;
      }
    }
    else if(day == 5)
    {
      if($scope.buttontype.Fri == "button")
      {
        $scope.buttontype.Fri = "button button-assertive";
        $scope.drug.Fri = true;
      }
      else
      {
        $scope.buttontype.Fri = "button"; 
        $scope.drug.Fri = false;
      }
    }
    else if(day == 6)
    {
      if($scope.buttontype.Sat == "button")
      {
        $scope.buttontype.Sat = "button button-assertive";
        $scope.drug.Sat = true;
      }
      else
      {
        $scope.buttontype.Sat = "button"; 
        $scope.drug.Sat = false;
      }
    }
    else
    {
      if($scope.buttontype.Sun == "button")
      {
        $scope.buttontype.Sun = "button button-assertive";
        $scope.drug.Sun = true;
      }
      else
      {
        $scope.buttontype.Sun = "button"; 
        $scope.drug.Sun = false;
      }
    }
  }

}])


