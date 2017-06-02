var app = angular.module('Plusoft', ['ngRoute', 'ngMaterial']);

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
       templateUrl: "views/forms/form5_common.html",
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
      .when('/start/14', {
       templateUrl: "views/forms/form14_own.html",
       controller: 'appController'
      })
      .when('/start/15', {
       templateUrl: "views/forms/form15_own.html",
       controller: 'appController'
      })
      .when('/start/16', {
       templateUrl: "views/forms/form16_own.html",
       controller: 'appController'
      })
      .when('/final', {
       templateUrl: "views/forms/form-final.html",
       controller: 'appController'
      })
      .otherwise({ redirectTo: '/' });

      $locationProvider.hashPrefix('');
}]);

/*
      OBJETOS DE CONTROLE DE NAVEGAÇÃO DE TELA
*/

var pageFlow = new Map();
pageFlow.set('form-1', '/start/1');
pageFlow.set('form-2', '/start/2');
pageFlow.set('form-3', '/start/3');
pageFlow.set('form-4', '/start/4');
pageFlow.set('form-5', '/start/5');
pageFlow.set('form-6', '/start/6');
pageFlow.set('form-7', '/start/7');
pageFlow.set('form-8', '/start/8');
pageFlow.set('form-9', '/start/9');
pageFlow.set('form-10', '/start/10');
pageFlow.set('form-11', '/start/11');
pageFlow.set('form-12', '/start/12');
pageFlow.set('form-13', '/start/13');
pageFlow.set('form-14', '/start/14');
pageFlow.set('form-15', '/start/15');
pageFlow.set('form-16', '/start/16');
pageFlow.set('form-final', '/final');
    
// Fluxo de exibição para seleção de imóvel 'Alugado'
var renterPageFlow = ['form-1', 'form-2', 'form-3', 'form-4', 'form-5', 'form-6', 'form-final'];

/*
      Fluxo de exibição para seleção de imóvel 'Próprio' e tipo de propriedade 'Condomínio'.
            -> Para estas condições há fluxos diferentes para as opções de financiamento existente/não existente.
*/
var ownerCondoPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-10', 'form-4', 'form-5', 'form-11', 'form-12', 'form-final']; 
var ownerCondoLoanPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-10', 'form-4', 'form-5','form-11', 'form-12', 'form-final'];
var ownerCondoNoLoanPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-10', 'form-4', 'form-5','form-11', 'form-14', 'form-final'];
var ownerCondoLoanNoPolicyPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-10', 'form-4', 'form-5','form-11', 'form-12', 'form-14', 'form-final'];


var ownerHousePageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-8', 'form-9'];
var ownerHouseMovePageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-8', 'form-9', 'form-13', 'form-10', 'form-4', 'form-5', 'form-11'];
var ownerHouseNoMovePageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-8', 'form-9', 'form-10', 'form-4', 'form-5', 'form-11'];

var ownerHouseMoveNoLoanPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-8', 'form-9', 'form-13','form-10', 'form-4', 'form-5', 'form-11', 'form-6', 'form-15', 'form-16', 'form-final'];
var ownerHouseNoMoveNoLoanPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-8', 'form-9', 'form-10', 'form-4', 'form-5', 'form-11', 'form-6', 'form-15', 'form-16', 'form-final'];

var ownerHouseMoveLoanPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-8', 'form-9', 'form-13', 'form-10', 'form-4', 'form-5', 'form-11', 'form-12'];
var ownerHouseNoMoveLoanPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-8', 'form-9', 'form-10', 'form-4', 'form-5', 'form-11', 'form-12'];

var ownerHouseMovePolicyPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-8', 'form-9', 'form-13', 'form-10', 'form-4', 'form-5', 'form-11', 'form-12', 'form-15', 'form-16', 'form-final'];
var ownerHouseMoveNoPolicyPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-8', 'form-9', 'form-13', 'form-10', 'form-4', 'form-5', 'form-11', 'form-12', 'form-6', 'form-15', 'form-16', 'form-final'];

var ownerHouseNoMovePolicyPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-8', 'form-9', 'form-10', 'form-4', 'form-5', 'form-11', 'form-12', 'form-15', 'form-16', 'form-final'];
var ownerHouseNoMoveNoPolicyPageFlow = ['form-1', 'form-2', 'form-3', 'form-7', 'form-8', 'form-9', 'form-10', 'form-4', 'form-5', 'form-11', 'form-12', 'form-6', 'form-15', 'form-16', 'form-final'];
