'use strict';

describe('Controller: LogoutCtrl', function () {

  // load the controller's module
  beforeEach(module('hoursApp'));

  var scope, createController;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    
    createController = function(){
      return $controller('LogoutCtrl', {
        $scope: scope
      });
    }
  }));

  it('Will make sure user get logged out when controller is initiated', inject(function (userService) {
    spyOn(userService, "Logout");

    createController();

    expect(userService.Logout).toHaveBeenCalled();
  }));
});
