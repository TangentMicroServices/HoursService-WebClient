'use strict';

describe('Controller: AddentryCtrl', function () {

  // load the controller's module
  beforeEach(module('hoursApp'));

  var AddentryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddentryCtrl = $controller('AddentryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
