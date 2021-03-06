'use strict';

describe('Controller: EditentryCtrl', function () {

  // load the controller's module
  beforeEach(module('hoursApp'));

  var EditentryCtrl, $q,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, entryService, _$q_) {
    scope = $rootScope.$new();
    $q = _$q_;
    $rootScope.CurrentUser = {
      id : 1
    }

    EditentryCtrl = $controller('EditentryCtrl', {
      $scope: scope
    });

    spyOn(entryService, 'GetSelectedEntry').and.returnValue({
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
    });

  }));

  var fakeErrorFields = {
    "start_time": ["Please send a valid start_time"],
    "end_time": ["Please send a valid end_time"]
  }

  var fakeSuccessPromise = function(){
      var deferred = $q.defer();

      deferred.resolve();

      return deferred.promise;
  };

  var fakeErrorPromise = function(){
      var deferred = $q.defer();

      deferred.reject(fakeErrorFields);

      return deferred.promise;
  };

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

  it('When you edit your entry and click save, make sure button text changes.', inject(function ($httpBackend, entryService) {
    spyOn(entryService, 'Edit').and.callFake(fakeSuccessPromise);

    expect(scope.saveButtonText).toBe('Save');

    scope.Submit();

    expect(scope.saveButtonText).toBe('Saving');
  }));

  it('When you edit your entry, make sure that edit gets called with the entry.', inject(function ($httpBackend, entryService) {
    spyOn(entryService, 'Edit').and.callFake(fakeSuccessPromise);

    scope.Submit();

    expect(entryService.Edit).toHaveBeenCalledWith(scope.entry);
  }));

  it('When your entry has succesfully been edited, make sure the user receives a notification. ', inject(function(entryService, notificationService){
    spyOn(entryService, 'Edit').and.callFake(fakeSuccessPromise);
    spyOn(notificationService, 'success');

    scope.Submit();
    scope.$digest();

    expect(notificationService.success).toHaveBeenCalledWith('Your entry has been updated.');
  }));

  it('When you entry has been added succesfully, make sure the user is routed to the view entries page.', inject(function(entryService, $location){
    spyOn(entryService, 'Edit').and.callFake(fakeSuccessPromise);
    spyOn($location, 'path');

    scope.Submit();
    scope.$digest();

    expect($location.path).toHaveBeenCalledWith('/myhours');
  }));

  it('When you edit your entry and the server fails to update it, make sure the user receives a notification.', inject(function(entryService, notificationService){
    spyOn(entryService, 'Edit').and.callFake(fakeErrorPromise);
    spyOn(notificationService, 'error');

    scope.Submit();
    scope.$digest();

    expect(notificationService.error).toHaveBeenCalledWith('Your entry failed to update.');
  }));

  it('When you edit your entry and the server fails to update it, make sure that the error messages are set.', inject(function(entryService, notificationService){
    spyOn(entryService, 'Edit').and.callFake(fakeErrorPromise);

    scope.Submit();
    scope.$digest();

    expect(scope.errorMessage).toEqual(fakeErrorFields);
    expect(scope.errorOccured).toBe(true);
  }));

  it('Receives tasks from event loadCurrentTasks', inject(function(){
    scope.task = {
      id: 1,
      title: 'Title must change'
    };
    scope.$emit('loadCurrentTasks', [{ id: 1, title: 'Task 1' }]);
    expect(scope.task.id).toEqual(1);
    expect(scope.task.title).toEqual('Task 1');
  }));

});
