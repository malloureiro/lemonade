var app = angular.module('Lemonade', ['ngRoute']);

app.config(['$routeProvider','$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
       templateUrl: "views/institutional.html",
       controller: 'appController'
      })
      .when('/start/1', {
       templateUrl: "views/forms/form1_common.html",
       controller: 'appController'
      })
      .when('/start/2', {
       templateUrl: "views/forms/form2_common.html",
       controller: 'appController'
      })
      .when('/start/3', {
       templateUrl: "views/forms/form3_common.html",
       controller: 'appController'
      })
      .when('/start/4', {
       templateUrl: "views/forms/form4_common.html",
       controller: 'appController'
      })
      .when('/start/5', {
       templateUrl: "views/forms/form5_rent.html",
       controller: 'appController'
      })
      .when('/start/6', {
       templateUrl: "views/forms/form6_common.html",
       controller: 'appController'
      })
      .when('/start/7', {
       templateUrl: "views/forms/form7_own.html",
       controller: 'appController'
      })
      .when('/start/8', {
       templateUrl: "views/forms/form8_own.html",
       controller: 'appController'
      })
      .when('/start/9', {
       templateUrl: "views/forms/form9_own.html",
       controller: 'appController'
      })
      .when('/start/10', {
       templateUrl: "views/forms/form10_own.html",
       controller: 'appController'
      })
      .when('/start/11', {
       templateUrl: "views/forms/form11_own.html",
       controller: 'appController'
      })
      .when('/start/12', {
       templateUrl: "views/forms/form12_own.html",
       controller: 'appController'
      })
      .when('/start/13', {
       templateUrl: "views/forms/form13_own.html",
       controller: 'appController'
      })
      .when('/final', {
       templateUrl: "views/forms/form-final.html",
       controller: 'appController'
      })
      .otherwise({ redirectTo: '/' });

      $locationProvider.hashPrefix('');
}]);
