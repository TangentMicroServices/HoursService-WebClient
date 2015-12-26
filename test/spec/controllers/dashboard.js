'use strict';

describe('Controller: DashboardCtrl', function () {

    beforeEach(module('hoursApp'));

    var DashboardCtrl, scope, $httpBackend, $q;
    var data = {label: ["a", "b"]};

    beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$q_) {
        scope = $rootScope.$new();
        $httpBackend = _$httpBackend_;
        $q = _$q_;

        DashboardCtrl = $controller('DashboardCtrl', {
            $scope: scope
        });
    }));

    var fakeSuccessPromise = function(){
        var deferred = $q.defer();

        deferred.resolve();

        return deferred.promise;
    };

    it('When loading the dashboard make sure load user summary is called.', inject(function(userSummaryService){
        spyOn(userSummaryService, 'GetUserSummary').and.callFake(fakeSuccessPromise);

        var response = scope.LoadUserSummary(2);

        expect(userSummaryService.GetUserSummary).toHaveBeenCalledWith(2);
    }));

    it('When loading the dashboard make sure the data is returned and formatted correctly.',

        inject(function($httpBackend, HOURSSERVICE_BASE_URI, $controller, entryService, notificationService){

            var fakeUserSummaryData = {
                "hours_by_day": {
                    "index": [
                        "2015-12-01T00:00:00.000Z"
                    ],
                    "data": [
                        8
                    ],
                    "name": "hours"
                }
            };

            var fakeUserSummaryResponse = {
                "hours_by_day": {
                    "index": [
                        "1st Dec"
                    ],
                    "data": [
                        8
                    ],
                    "name": "hours"
                }
            };

            //Given
            $httpBackend.whenGET(HOURSSERVICE_BASE_URI + "/api/v1/usersummary/2/").respond(200, fakeUserSummaryData);

            //When
            scope.LoadUserSummary(2);
            $httpBackend.flush();

            //Then
            expect(scope.usersummary).toEqual(fakeUserSummaryResponse);

        }));
});