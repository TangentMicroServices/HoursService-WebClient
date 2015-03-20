'use strict';

describe('Controller: EntryformCtrl', function () {

  // load the controller's module
  beforeEach(module('hoursApp'));

  var EntryformCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    
    $rootScope.CurrentUser = {
      id: 1
    };

    EntryformCtrl = $controller('EntryformCtrl', {
      $scope: scope
    });
  }));

  it('When controller is loaded, the first hour in hours dropdown should be 1.', function () {
    expect(scope.hours[0]).toEqual({ hours: 1, description: '1 hours' });
  });

  it('When controller is loaded check that my tasks are laoded.', inject(function($httpBackend, PROJECTSERVICE_BASE_URI, projectService){
    spyOn(projectService, 'MyTasks').and.callFake();

    $httpBackend.expectGET(PROJECTSERVICE_BASE_URI + '/api/v1/tasks/?user=1').respond(200);

    $httpBackend.flush();
  }));

  it('When entry form controller is loaded, expect date format to be', function(){
    expect(scope.format).toBe('yyyy-MM-dd');
  })
});
