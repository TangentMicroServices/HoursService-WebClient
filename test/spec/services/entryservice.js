'use strict';

describe('Service: entryservice', function () {

  // load the service's module
  beforeEach(module('hoursApp'));

  // instantiate service
  var entryService, rootScope;
  beforeEach(inject(function (_entryService_, $rootScope) {
    rootScope = $rootScope.$new();
    rootScope.CurrentUser = {
      id : 1
    }

    entryService = _entryService_;
  }));

  var fakeEntry = {
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
  };

  it('When adding an entry, expect a post request to made to the hoursservice.', inject(function ($httpBackend, HOURSSERVICE_BASE_URI) {
    entryService.Add(fakeEntry);  

    $httpBackend.expectPOST(HOURSSERVICE_BASE_URI + '/api/v1/entry/', fakeEntry).respond(200, fakeEntry);

    $httpBackend.verifyNoOutstandingExpectation();
  }));

  it('When editing an entry, expect put request to be made to the hours service', inject(function($httpBackend, HOURSSERVICE_BASE_URI){
    entryService.Edit(fakeEntry);  

    $httpBackend.expectPUT(HOURSSERVICE_BASE_URI + '/api/v1/entry/' + fakeEntry.id + "/", fakeEntry).respond(200, fakeEntry);

    $httpBackend.verifyNoOutstandingExpectation();
  }));

  it('When deleting an entry, expect delete request to be made to the hours service', inject(function($httpBackend, HOURSSERVICE_BASE_URI){
    entryService.Delete(fakeEntry.id);  

    $httpBackend.expectDELETE(HOURSSERVICE_BASE_URI + '/api/v1/entry/' + fakeEntry.id + "/").respond(200, fakeEntry);

    $httpBackend.verifyNoOutstandingExpectation();
  }));

  it('When fetching a a specific entry, expect get request to be made to the hours service.', inject(function($httpBackend, HOURSSERVICE_BASE_URI){
    entryService.Get(fakeEntry.id);  

    $httpBackend.expectGET(HOURSSERVICE_BASE_URI + '/api/v1/entry/' + fakeEntry.id + "/").respond(200, fakeEntry);

    $httpBackend.verifyNoOutstandingExpectation();
  }));

  it('When fetching entries for specific user, make sure the correctly filtered get request gets sent to service. ', inject(function($httpBackend, HOURSSERVICE_BASE_URI){
    entryService.GetEntriesForUser(rootScope.CurrentUser.id);

    $httpBackend.expectGET(HOURSSERVICE_BASE_URI + '/api/v1/entry/?user=' + rootScope.CurrentUser.id ).respond(200, fakeEntry);

    $httpBackend.verifyNoOutstandingExpectation();
  }));

  it('When fetch all entries make sure the correct get url is fired.', inject(function($httpBackend, HOURSSERVICE_BASE_URI){
    entryService.GetAll();

    $httpBackend.expectGET(HOURSSERVICE_BASE_URI + '/api/v1/entry/').respond(200, fakeEntry);

    $httpBackend.verifyNoOutstandingExpectation();
  }));

  it('when an entry is selected, make sure when entry is retrieved again it is the same', inject(function(){
    entryService.EntrySelected(fakeEntry);

    var cachedEntry = entryService.GetSelectedEntry();

    expect(fakeEntry).toEqual(cachedEntry);
  }));
});
