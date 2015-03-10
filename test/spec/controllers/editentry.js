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

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
