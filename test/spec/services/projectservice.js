'use strict';

describe('Service: projectService', function () {

  // load the service's module
  beforeEach(module('hoursApp'));

  // instantiate service
  var projectService;
  beforeEach(inject(function (_projectService_) {
    projectService = _projectService_;
  }));

  var fakeTasks = [{ id: 1}, {id: 2}];

  xit('When fetching tasks for a specific user, make sure the url matches.', inject(function(PROJECTSERVICE_BASE_URI, $httpBackend, $rootScope){
    $rootScope.CurrentUser = {
      id: 1
    };

    $httpBackend.expectGET(PROJECTSERVICE_BASE_URI + '/api/v1/tasks/?user=' + $rootScope.CurrentUser.id).respond(200, fakeTasks);

    projectService.MyTasks();

    $httpBackend.verifyNoOutstandingExpectation();
  }));

  xit('When fetching tasks for a specific user, make sure that the tasks get stored in the project service.', inject(function($httpBackend, PROJECTSERVICE_BASE_URI, $rootScope){
    $rootScope.CurrentUser = {
      id: 1
    };

    $httpBackend.expectGET(PROJECTSERVICE_BASE_URI + '/api/v1/tasks/?user=' + $rootScope.CurrentUser.id).respond(200, fakeTasks);

    projectService.MyTasks();

    $httpBackend.flush();

    var areTasksLoaded = projectService.AreTasksLoaded();

    expect(areTasksLoaded).toBe(true);
  }));
});
