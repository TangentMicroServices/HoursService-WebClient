'use strict';

describe('Service: entryservice', function () {

  // load the service's module
  beforeEach(module('hoursApp'));

  // instantiate service
  var entryservice;
  beforeEach(inject(function (_entryservice_) {
    entryservice = _entryservice_;
  }));

  it('should do something', function () {
    expect(!!entryservice).toBe(true);
  });

});
