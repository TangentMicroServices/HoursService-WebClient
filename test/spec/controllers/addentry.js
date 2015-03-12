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
  }

  it('Will change the day to date format supported by hoursservice.', inject(function ($q, entryService) {
  
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

  it('After adding an entry you will be navigated to the view entries page', inject(function($httpBackend, entryService, $location, projectService){
  
    var deferred = $q.defer();
    
    spyOn(entryService, 'Add').and.returnValue(deferred.promise);

    $httpBackend.expectGET('http://staging.projectservice.tangentme.com/api/v1/tasks/?user=undefined').respond(200, []);
    spyOn($location, 'path');
    
    scope.Submit();
    $httpBackend.flush();
    deferred.resolve();
    scope.$digest();

    expect($location.path).toHaveBeenCalledWith('/viewEntries');

  }));

  it('When adding an antry you get a notification that the entry has been added.', inject(function(entryService, notificationService, $httpBackend, projectService){
    
    var deferred = $q.defer();

    spyOn(entryService, 'Add').and.returnValue(deferred.promise);

    $httpBackend.expectGET('http://staging.projectservice.tangentme.com/api/v1/tasks/?user=undefined').respond(200, []);
    spyOn(notificationService, 'success');

    scope.Submit();
    $httpBackend.flush();
    deferred.resolve();
    scope.$digest();

    expect(notificationService.success).toHaveBeenCalledWith('Entry added successfully.');
  }));

  it('Will validate that add entries is called.', inject(function(entryService){
    spyOn(entryService, 'Add').and.callFake(fakeCall);

    scope.Submit();

    expect(entryService.Add).toHaveBeenCalled();
  }));
});
