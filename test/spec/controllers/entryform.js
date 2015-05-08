'use strict';

describe('Controller: EntryformCtrl', function () {

  // load the controller's module
  beforeEach(module('hoursApp'));

  var EntryformCtrl, scope, $q;

  var mockDataServices = {
      MyTasks: function () {
          var deferred = $q.defer();

          deferred.resolve([
          {
            id: 1,
            project_data: {
              title: 'C'
            }
          },
          {
            id: 2,
            project_data: {
              title: 'A'
            }
          },
          {
            id: 3,
            project_data: {
              title: 'B'
            }
          }
        ]);

        return deferred.promise;
      }
  };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, projectService, _$q_) {
    var currentUser = $rootScope.CurrentUser = {"id": 1};
    $q = _$q_;
    scope = $rootScope.$new();

    EntryformCtrl = $controller('EntryformCtrl', {
      $scope: scope,
      projectService: mockDataServices
    });
  }));

  it('When controller is loaded, the first hour in hours dropdown should be 1.', function () {
    expect(scope.hours[0]).toEqual({ hours: 1, description: '1 hours' });
  });

  xit('When controller is loaded check that my tasks are loaded.', inject(function($httpBackend, $rootScope, PROJECTSERVICE_BASE_URI, projectService){
      $rootScope.CurrentUser = {id: 1}
      spyOn(projectService, 'MyTasks').and.callFake();

    $httpBackend.expectGET(PROJECTSERVICE_BASE_URI + '/api/v1/tasks/?user=1').respond(200);

    $httpBackend.flush();
  }));

  it('When entry form controller is loaded, expect date format to be', function(){
    expect(scope.format).toBe('yyyy-MM-dd');
  });

  it('Receives tasks and sorts them by their title', function(){
    scope.$digest();
    expect(scope.tasks.length).toEqual(3);
  });

  it('opens the calendar popup', function() {
    var eventMock = {
      preventDefault: function() {},
      stopPropagation: function() {}
    };
    scope.open(eventMock);
    expect(scope.opened).toEqual(true);
  });

  it('disable when scope.disabled has been called', function() {
    expect(scope.disabled()).toEqual(false);
  });
});
