'use strict';

angular.module('hoursApp')
    .controller('DashboardCtrl', function ($scope, entryService, projectService, notificationService, $location, $rootScope) {

        $scope.loaded = true;
        var isEntriesLoaded = false;
        var isProjectsLoaded = false;

        var init = function(){
            var userId = $rootScope.CurrentUser.id;

            loadProjects();

            if(typeof userId !== 'undefined')
            {
                loadEntries(userId);
            }
        };

        var loadProjects = function(){
            projectService.GetUserProjects($rootScope.CurrentUser.id).then(projectsLoaded, projectsLoadFailed);
        };

        var projectsLoaded = function(response){
            $scope.projects = response;
            isProjectsLoaded = true;

            if(isEntriesLoaded && isProjectsLoaded){
                loadCurrentMonthProjectsHoursCart();
            }

            /*$scope.projects.unshift({title: '- All projects -'});

            if(typeof $rootScope.project === 'undefined'){
                $scope.project = $scope.projects[0];
                $rootScope.project = 0;
            }else{
                $scope.project = $scope.projects[Number($rootScope.project)];
            }*/
        };

        var projectsLoadFailed = function(response){};

        var loadEntries = function(userId){

            entryService.GetEntries(userId, 2, "")
                .success(onEntriesLoaded)
                .error(onEntriesLoadFailed);
        };

        var onEntriesLoaded = function(data){
            $scope.entries = data;
            $scope.loaded = true;
            isEntriesLoaded = true;

            if(isEntriesLoaded && isProjectsLoaded){
                loadCurrentMonthProjectsHoursCart();
            }
        };

        var onEntriesLoadFailed = function(data){
            notificationService.error('failed to load entries.');
            $scope.loaded = true;
        };

        var loadCurrentMonthProjectsHoursCart = function(){
            var entries = $scope.entries;
            var projects = $scope.projects;

            var uniqueProjects = _.pluck(_.uniq(entries, function(hour) { return hour.project_id; }), "project_id")

            var namedProjects =  _.filter(projects, function(item){
                return _.contains(uniqueProjects, item["pk"]);
            });

            var projects = {
                2: "Acme",
                45: "Wayne Enterprises"
            }

            {[2, 45], [5, 100]}

            $scope.labels = ["Acme", "Enterprises"]//_.pluck(namedProjects, "title");
            $scope.data = [45, 100];


            debugger;
        };
/*
    GET /UserSummary
        {
        date_range: {},
        profile: {},
        overview: {
          total: ,
          average: ,
          overtime: ,
          leave: ,
          ...
        }
        project_breakdown: [
            {name:, id, hours_count},
            ...
        ],
        daily_breakdown: [
            {date:, hours_count}
        ],
         weekly_breakdown: [
         {date:, hours_count}
         ]
        }
*/
        init();
    });
