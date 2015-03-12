'use strict';

describe('Service: entryservice', function () {

  // load the service's module
  beforeEach(module('hoursApp'));

  // instantiate service
  var entryService;
  beforeEach(inject(function (_entryService_) {
    entryService = _entryService_;
  }));

  it('should do something', function () {
    expect(!!entryService).toBe(true);
  });

});
