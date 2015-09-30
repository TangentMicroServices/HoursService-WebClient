'use strict';

describe('Controller: AddentryCtrl', function () {

    beforeEach(module('hoursApp'));

    var EntriesCtrl, scope, $q;

    beforeEach(inject(function ($controller, $rootScope, _$q_) {
        scope = $rootScope.$new();

        $rootScope.CurrentUser = {
            id : 1
        };

        $q = _$q_;
        EntriesCtrl = $controller('EntriesCtrl', {
            $scope: scope
        });
    }));

    var fakeCall = function(){
        var deferred = $q.defer();

        deferred.resolve();

        return deferred.promise;
    };

    var fakeSuccessPromise = function(){
        var deferred = $q.defer();

        deferred.resolve();

        return deferred.promise;
    };


    it('When deleting an entry, make sure the entry delete entry is called.', inject(function(entryService){
        spyOn(entryService, 'Delete').and.callFake(fakeSuccessPromise);

        var entry = {
          id: 2
        };

        scope.selectedItem = entry;

        scope.Delete();

        expect(entryService.Delete).toHaveBeenCalledWith(2);
    }));

    xit('When deleting an entry, make sure that user gets a notification', inject(function($httpBackend, PROJECTSERVICE_BASE_URI, HOURSSERVICE_BASE_URI, USERSERVICE_BASE_URI, entryService, notificationService){
        spyOn(entryService, 'Delete').and.callFake(fakeSuccessPromise);
        spyOn(notificationService, 'success');

        var entry = {
        id: 2
        };

        $httpBackend.expectGET(HOURSSERVICE_BASE_URI +'/api/v1/entry/?user=1').respond(200, []);
        $httpBackend.expectGET(PROJECTSERVICE_BASE_URI +'/api/v1/tasks/?user=1').respond(200, []);
        //$httpBackend.expectGET(PROJECTSERVICE_BASE_URI +'/api/v1/tasks/').respond(200, []);
        $httpBackend.expectGET(USERSERVICE_BASE_URI +'/api/v1/users/').respond(200, []);
        //Reload entries after deleted....
        $httpBackend.expectGET(HOURSSERVICE_BASE_URI +'/api/v1/entry/?user=1').respond(200, []);

        scope.Delete(entry);
        $httpBackend.flush();
        scope.$digest();
        //
        expect(notificationService.success).toHaveBeenCalledWith('Your entry has successfully been deleted.');
    }));

    it('When edit entry is clicked. user is navigated to the edit entry page.', inject(function(entryService, $location) {
        spyOn(entryService, 'EntrySelected');
        spyOn($location,'path');

        var entry = {
          id: 2
        };

        scope.Edit(entry);

        expect($location.path).toHaveBeenCalledWith('/editEntry');
    }));

    xit('When deleting and entry and the entry fails to delete, make sure user gets a notification.', inject(function($httpBackend, entryService, PROJECTSERVICE_BASE_URI, HOURSSERVICE_BASE_URI, USERSERVICE_BASE_URI, notificationService){
        spyOn(entryService, 'Delete').and.callFake(fakeFailedPromise);
        spyOn(notificationService, 'error');

        var entry = {
          id: 2
        };

        $httpBackend.expectGET(HOURSSERVICE_BASE_URI +'/api/v1/entry/?user=1').respond(200, []);
        $httpBackend.expectGET(PROJECTSERVICE_BASE_URI +'/api/v1/tasks/?user=1').respond(200, []);
          $httpBackend.expectGET(USERSERVICE_BASE_URI +'/api/v1/users/').respond(200, []);

        scope.Delete(entry);

        $httpBackend.flush();
        scope.$digest();

        expect(notificationService.error).toHaveBeenCalledWith("Failed to delete your entry.");
    }));
});
