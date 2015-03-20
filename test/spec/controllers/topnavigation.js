'use strict';

describe('Controller: TopnavigationCtrl', function () {

  // load the controller's module
  beforeEach(module('hoursApp'));

  var TopnavigationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TopnavigationCtrl = $controller('TopnavigationCtrl', {
      $scope: scope
    });
  }));

  it('When user logged out it should display the correct navigation.', function () {
    
    var loggedOutMenu = [
      { url: '#login', title: 'Login' }
    ];

    expect(scope.rightLoggedOut).toEqual(loggedOutMenu);
  });

  it('When user logs in it should display the correct left navigation.', function(){

    var loggedInMenu = [
      { url: '#viewEntries', title: 'View Entries'},
      { url: '#addEntry', title: 'Add Entry' }
    ];

    expect(scope.leftLoggedIn).toEqual(loggedInMenu);
  });

    it('When user logs in it should display the correct right navigation.', function(){

        var loggedInMenu = [
            { url: '#logout', title: 'Logout' }
        ];

        expect(scope.rightLoggedIn).toEqual(loggedInMenu);
    });
  
});
