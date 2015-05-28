'use strict';

describe('Controller: AddentryCtrl', function () {

  beforeEach(module('hoursApp'));

  var AddentryCtrl, scope, $q;

  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    scope = $rootScope.$new();

    $rootScope.CurrentUser = {
      id : 1
    }

    $q = _$q_;
    AddentryCtrl = $controller('AddentryCtrl', {
      $scope: scope
    });
  }));

  var fakeCall = function(){
      var deferred = $q.defer();

      deferred.resolve();

      return deferred.promise;
  };

  var fakeErrorFields = {
    "start_time": ["Please send a valid start_time"],
    "end_time": ["Please send a valid end_time"]
  }

  var fakeBadEntryAddCall = function(){
      var deferred = $q.defer();

      deferred.reject(fakeErrorFields);

      return deferred.promise;
  };

  // need to mock the times .. or handle timezones
  xit('Will change the day to date format supported by hoursservice.', inject(function ($q, entryService) {

    spyOn(entryService, 'Add').and.callFake(fakeCall);

    scope.entry = {
      id: 1,
      user: 1,
      project_id: 1,
      project_task_id: 1,
      status: 'Open',
      day: '2015-03-09T22:00:00.000Z',
      start_time: '08:00:00',
      end_time: '17:00:00',
      hours: 8,
      overtime: 0,
      tags: ''
    }

    var expectedEntry = {
      id: 1,
      user: 1,
      project_id: 1,
      project_task_id: 1,
      status: 'Open',
      day: '2015-03-10',
      start_time: '08:00:00',
      end_time: '17:00:00',
      hours: 8,
      overtime: 0,
      tags: ''
    }

    scope.Submit();

    expect(scope.entry).toEqual(expectedEntry);
    expect(entryService.Add).toHaveBeenCalledWith(expectedEntry);
  }));

  it('Updates the entry with the correct data from the task object', function () {

    scope.entry = {
      id: 1,
      user: 1,
      project_id: 0,
      project_task_id: 0,
      status: 'Open',
      day: '2015-03-09T22:00:00.000Z',
      start_time: '08:00:00',
      end_time: '17:00:00',
      hours: 8,
      overtime: 0,
      tags: ''
    }

    scope.task = {
      id: 1,
      project: 2
    }

    var expectedEntry = {
      id: 1,
      user: 1,
      project_id: 2,
      project_task_id: 1,
      status: 'Open',
      day: '2015-03-10',
      start_time: '08:00:00',
      end_time: '17:00:00',
      hours: 8,
      overtime: 0,
      tags: ''
    }

    scope.Change();
    scope.Submit();

    expect(scope.entry.project_id).toEqual(expectedEntry.project_id);
    expect(scope.entry.project_task_id).toEqual(expectedEntry.project_task_id);
  });

  it('After adding an entry you will be navigated to the view entries page', inject(function(PROJECTSERVICE_BASE_URI, $httpBackend, entryService, $location, projectService){
    spyOn(entryService, 'Add').and.callFake(fakeCall);

    spyOn($location, 'path');

    scope.Submit();
    scope.$digest();

    expect($location.path).toHaveBeenCalledWith('/viewOpenEntries');
  }));

  it('When adding an antry you get a notification that the entry has been added.', inject(function(PROJECTSERVICE_BASE_URI, entryService, notificationService, $httpBackend, projectService){
    spyOn(entryService, 'Add').and.callFake(fakeCall);

    spyOn(notificationService, 'success');

    scope.Submit();
    scope.$digest();

    expect(notificationService.success).toHaveBeenCalledWith('Entry added successfully.');
  }));

  it('When adding the entry fails, check that user receives an error notification', inject(function(PROJECTSERVICE_BASE_URI, $httpBackend, entryService, notificationService){
    spyOn(entryService, 'Add').and.callFake(fakeBadEntryAddCall);

    spyOn(notificationService, 'error');

    scope.Submit();
    scope.$digest();

    expect(notificationService.error).toHaveBeenCalledWith('Failed to add your entry.');
  }));

  it('When adding the entry fails, check that the error message on fields gets populated.', inject(function(PROJECTSERVICE_BASE_URI, $httpBackend, entryService, notificationService){

    spyOn(entryService, 'Add').and.callFake(fakeBadEntryAddCall);

    spyOn(notificationService, 'error');

    scope.Submit();
    scope.$digest();

    expect(scope.errorMessage).toEqual(fakeErrorFields);
    expect(scope.errorOccured).toBe(true);
  }));

  it('Will validate that add entries is called.', inject(function(entryService){
    spyOn(entryService, 'Add').and.callFake(fakeCall);

    scope.Submit();

    expect(entryService.Add).toHaveBeenCalled();
  }));

  it('Receives tasks from event loadCurrentTasks', inject(function(){
    expect(scope.task).toEqual({});
    scope.$emit('loadCurrentTasks', [{ id: 1, title: 'Task 1' }]);
    expect(scope.task.id).toEqual(1);
    expect(scope.task.title).toEqual('Task 1');
  }));
});
