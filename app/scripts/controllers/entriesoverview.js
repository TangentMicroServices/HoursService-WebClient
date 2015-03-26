'use strict';

angular.module('hoursApp')
    .controller('EntriesOverviewCtrl', function ($scope, $rootScope, $location, notificationService,
                                             userService, entryService, projectService) {

        $scope.entries = [];


        init();
    });
