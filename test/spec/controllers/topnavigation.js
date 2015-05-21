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
      { url: '#viewOpenEntries', title: 'Open Entries'},
      { url: '#viewEntries', title: 'Submitted Entries'},
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

  it('displays the appropriate buttons when logged in', function() {
    scope.$emit('UserLoggedIn');
    expect(scope.leftNavigationItems).toEqual(scope.leftLoggedIn);
    expect(scope.rightNavigationItems).toEqual(scope.rightLoggedIn);
  });

  it('displays the appropriate buttons when logged out', function() {
    scope.$emit('UserLoggedOut');
    expect(scope.leftNavigationItems).toEqual(scope.leftLoggedOut);
    expect(scope.rightNavigationItems).toEqual(scope.rightLoggedOut);
  });

});
