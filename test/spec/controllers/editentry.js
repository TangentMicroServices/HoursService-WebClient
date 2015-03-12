'use strict';

describe('Controller: EditentryCtrl', function () {

  // load the controller's module
  beforeEach(module('hoursApp'));

  var EditentryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditentryCtrl = $controller('EditentryCtrl', {
      $scope: scope
    });
  }));

  it('Should call hoursservice to edit', function () {
      
  });
});
