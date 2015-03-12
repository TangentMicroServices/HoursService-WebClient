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

  it('Will change the day to date format supported by hoursservice.', inject(function () {
    

  }));
});
