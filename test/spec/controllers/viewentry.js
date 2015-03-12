'use strict';

describe('Controller: ViewentryCtrl', function () {

  // load the controller's module
  beforeEach(module('hoursApp'));

  var ViewentryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewentryCtrl = $controller('ViewentryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    
  });
});
