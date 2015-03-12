'use strict';

describe('Controller: AddentryCtrl', function () {

  beforeEach(module('hoursApp'));

  var AddentryCtrl, scope, $q;

  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    scope = $rootScope.$new();
    $q = _$q_;
    AddentryCtrl = $controller('AddentryCtrl', {
      $scope: scope
    });
  }));

  var fakeCall = function(){
      var deferred = $q.defer();

      deferred.resolve({ "Message": "entry added succesfully." });

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

  it('Will validate that add entries is called.', inject(function(entryService){
    spyOn(entryService, 'Add').and.callFake(fakeCall);

    scope.Submit();

    expect(entryService.Add).toHaveBeenCalled();
  }));
});
