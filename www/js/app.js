 // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ui.calendar'])

.run(function($ionicPlatform) {

  //PARSE KEYS
  Parse.initialize("ZcOTt5crhMxXE7MRPRAhaMvMNrZqMAiZ1gnK1ZyL", "n9wt2V7nt2H27EZKQsE8UqKxpcgMmbiUQ74TQXwg");
  Parse.serverURL = 'https://parseapi.back4app.com/'
  //App id , JavaScript id
  
  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      //cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

 

  });
})

.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
  .state('welcome', {
    url: '/',
    templateUrl: 'templates/welcome.html',
    controller: 'main'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signUp'
  })
  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'login'
  })
  .state('userlist', {
    url: '/userlist',
    templateUrl: 'templates/userlist.html',
    controller: 'userlist'
  })
  .state('reset', {
    url:'/reset',
    templateUrl: 'templates/reset.html',
    controller: 'reset'
  }) //make sure to get rid of this semi colon when adding another state
 .state('addDrug', {
     url:'/addDrug',
     templateUrl: 'templates/addDrug.html',
     controller: 'addDrug'
   })
  .state('druglist', {
     url:'/druglist',
     templateUrl: 'templates/druglist.html',
     controller: 'druglist'
   });
 
 
  $urlRouterProvider.otherwise('/');
 
})
