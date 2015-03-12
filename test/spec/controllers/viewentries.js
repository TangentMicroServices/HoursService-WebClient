'use strict';

describe('Controller: ViewentriesCtrl', function () {

  // load the controller's module
  beforeEach(module('hoursApp'));

  var ViewentriesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewentriesCtrl = $controller('ViewentriesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
   
  });
});
