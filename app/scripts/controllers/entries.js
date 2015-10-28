'use strict';

/**
 * @ngdoc function
 * @name hoursApp.controller:ViewentriesCtrl
 * @description
 * # ViewentriesCtrl
 * Controller of the hoursApp
 */
angular.module('hoursApp')
    .controller('EntriesCtrl', function ($scope, $filter, $rootScope, $location, notificationService, userService, entryService, projectService) {

        $scope.getWeekdays = function(day){
          day = day || moment();
          var today = day.clone();
          var monday = today.clone().startOf('week');
          var days = [];
          for(var i=1; i <= 7; i++){
            var current = monday.clone().add(i, 'days');
            days.push(current.format());
          }
          return days;
        };

        $scope.days = $scope.getWeekdays();

        $scope.dailyTotals = [[], [], [], [], [], [], []];

        $scope.getDailyTotal = function(array) {
          var result = 0;
          for (var i = 0; i < array.length; i++) {
            result += Number(array[i]) || 0;
          }
          return result;
        };

        $scope.getProjectWeeklyTotal = function(project_index) {
          var weeklyTotal = 0;
          for (var i = 0; i < $scope.dailyTotals.length; i++) {
            weeklyTotal += Number($scope.dailyTotals[i][project_index]) || 0;
          }
          return weeklyTotal;
        };

        $scope.getWeeklyTotal = function() {
          var total = 0;
          for (var day = 0; day < $scope.dailyTotals.length; day++) {
            var projectEntries = $scope.dailyTotals[day];

            for (var entry = 0; entry <  projectEntries.length; entry++) {
              total += Number(projectEntries[entry]) || 0;
            }
          }
          return total;
        };

        var stickyNote = angular.element(document.querySelector('.sticky-note'))[0];
        var UITable = angular.element(document.querySelector('#newuitable'))[0];
        var stickyNoteTextarea = angular.element(document.querySelector('.sticky-note textarea'))[0];
        var currentCell = null; // contains the current active cell

        $scope.revealCommentBox = function(event) {
          stickyNote.style.display = "block";
          stickyNote.style.left = event.pageX + "px";
          stickyNote.style.top = event.pageY + "px";
          currentCell = event.currentTarget.parentElement;
          var entryIndex = event.currentTarget.parentElement.dataset.entryIndex || null;
          var project_index = angular.element(event.currentTarget.parentElement).parentsUntil('tbody')[1].rowIndex - 1;
          var project = $scope.projects[project_index];
          var tasks = $filter('filter')($scope.tasks, {project: project.pk}, true);
          $scope.project_tasks = tasks;

          console.log(project, tasks);
          if (entryIndex) {
            angular.element(document.querySelector('.sticky-note')).attr('data-entry-index', entryIndex);
            stickyNoteTextarea.value =  $scope.entries[entryIndex].comments || "";
          }
          event.stopPropagation();
        };

        var entryUpdated = function(){
          currentCell = null;
          stickyNoteTextarea.value = "";
          notificationService.success('Entry updated successfully.');
        };

        var entryDidNotUpdate = function(response){
          currentCell = null;
          stickyNoteTextarea.value = "";
          notificationService.error('Failed to update your entry.');
        };


        var entryAdded = function(){
          notificationService.success('Entry added successfully.');
        };

        var entryDidNotAdd = function(response){
          notificationService.error('Failed to add your entry.');
        };

        UITable.onclick = function() {
          if(stickyNote.style.display){

            stickyNote.style.display = 'none';

            // check if an entry exists
            var entryIndex = angular.element(document.querySelector('.sticky-note')).attr('data-entry-index') || null;

            if(entryIndex) {
              var entry = $scope.entries[entryIndex];
              entry.comments = stickyNoteTextarea.value;
              entry.day = new moment(entry.day).format("YYYY-MM-DD");

              // update the entry
              entryService.Edit(entry)
              .then(entryUpdated, entryDidNotUpdate);

            } else {
              // validate the new entry
              var hours = Number(angular.element(angular.element(currentCell).children()[0]).val());
              var comment = stickyNoteTextarea.value;

              if(hours > 0 && comment.length > 0) {
                  var project_td = angular.element(currentCell).parent()[0];
                  var project_tr = angular.element(project_td).parent()[0].rowIndex;
                  var project_index = project_tr -1;
                  createNewEntry(hours, project_index);
              }
            }
          }
        };

        var createNewEntry = function(hours, project_index){
          var newEntry = {
            id: null,
            user: $rootScope.CurrentUser.id,
            project_id: $scope.projects[project_index].pk,
            // TODO fix this!!!!
            project_task_id: $scope.projects[project_index].task_set[0].id,
            status: 'Open',
            day: $scope.days[angular.element(currentCell)[0].parentNode.cellIndex-1],
            start_time: '08:00:00',
            end_time: '17:00:00',
            comments: stickyNoteTextarea.value,
            hours: hours,
            overtime: 0,
            tags: ''
          };

          newEntry.day = new moment(newEntry.day).format('YYYY-MM-DD');

          entryService.Add(newEntry)
            .then(entryAdded, entryDidNotAdd);
        };

        // load the days of the previous week
        $scope.getPreviousWeek = function() {
          var day = moment(Date.parse($scope.days[0])).subtract(2, 'days');
          $scope.days = $scope.getWeekdays(day);
        };
        // load the days of the next week
        $scope.getNextWeek = function() {
          var day = moment(Date.parse($scope.days[0])).add(1, 'weeks');
          $scope.days = $scope.getWeekdays(day);
        };

        // repopulate the calender when the entries or days change
        $scope.$watch('entries', function(){
          populateEntries()
        });
        $scope.$watch('days', function(){
          populateEntries()
        });

        function populateEntries(){
          var row = angular.element(document.querySelectorAll('#newuitable input'));

          // clear all the inputs
          for (var i = 0; i < row.length; i++) {
            row[i].value = "";
            angular.element(row[i]).trigger('input');
          }

          // get the entries for a day
          $scope.days.forEach(function(element, dayIndex, array) {
            var filter_date = moment(Date.parse(element)).format("YYYY-MM-DD");
            var dayEntries = $filter('filter')($scope.entries, {day:filter_date}, true);

            // fill the appropriate cell according to project
            angular.forEach(dayEntries, function(entry, key) {
              var project = $filter('filter')($scope.projects, {pk: entry.project_id}, true);
              var entryIndex = $scope.entries.indexOf(entry);
              var project_index = $scope.projects.indexOf(project[0]);
              $scope.fillHours(dayIndex, project_index, entryIndex); // fill the table cell
            });

          });
        };

        // fill the calender cells with data from the hours service
        $scope.fillHours = function(dayIndex, projectIndex, entryIndex){
          var hoursCell = angular.element(document.querySelector('#newuitable tbody tr:nth-child('+ (projectIndex+1) +') td:nth-child('+ (dayIndex+2)  +') .note'));
          var hoursTextBox = angular.element(document.querySelector('#newuitable tbody tr:nth-child('+ (projectIndex+1) +') td:nth-child('+ (dayIndex+2) +') input'));
          if (hoursTextBox)
            hoursTextBox[0].value = $scope.entries[entryIndex].hours;
            hoursCell.attr("data-entry-index", entryIndex);
            hoursTextBox.trigger('input');
        };

        window.onkeydown = function( event ) {
          if ( event.keyCode === 27 ) {
              stickyNote.style.display = 'none';
              stickyNoteTextarea.value = '';
              currentCell = null;
            }
        };

        var colors = ['#D0DD2B', '#98C73D', '#00A9E0', '#67CDDC', '#3B3B3D'];

        $scope.assignColor = function(title) {
          title = title.replace(/[aeiou]/ig,'');
          var total = 0;
          for (var i = 0; i < title.length; i++) {
            total += title.charCodeAt(i);
          }
          var color = colors[total % colors.length];
          return color;
        };

        $scope.options = {
            animate:{
                duration:800,
                enabled:true
            },
            barColor:'#00C4B5',
            scaleColor:false,
            lineWidth:20,
            lineCap:'circle'
        };

        $scope.dateRangeTypes = [
            {id : 0, key : '', value: 'Show All'},
            {id : 1, key : '1', value : 'Today'},
            {id : 2, key : '2', value : 'This Week'},
            {id : 3, key : '3', value : 'This Month'},
            {id : 4, key : '5', value : 'Last Month'},
            {id : 5, key : '4', value : 'This Year'}
        ];
        //Defaulting hours to this month
        $scope.dateRange;
        $scope.submit = false;

        $scope.entriesForSubmission = [];

        $scope.entries = [];
        $scope.tasks = [];
        $scope.projects = [];
        $scope.users = [];
        $scope.selectedUser = null;
        $scope.selectedItem = null;
        $scope.task = null;
        $scope.project = null;
        $scope.deletingItem = false;

        var entryDeleted = function(response){
            var userId = $scope.selectedUser.id;
            notificationService.success('Your entry has successfully been deleted.');
            loadEntries(userId);
        };

        var entryDeletionFailed = function(response){
            notificationService.error('Failed to delete your entry.');
            $scope.deletingItem = false;
        };

        var onEntriesLoaded = function(data){
           $scope.entries = data;
            $scope.loaded = true;
            $scope.deletingItem = false;

            $scope.totalOpenHours = _.reduce($scope.entries, function(sum, el) {
                return sum + parseFloat(el.hours)
            }, 0);

            $scope.percent = ($scope.totalOpenHours / 160) * 100;
        };

        var onEntriesLoadFailed = function(data){
            notificationService.error('failed to load entries.');
            $scope.deletingItem = false;
        };

        var loadTasks = function(){
            projectService.MyTasks().then(tasksLoaded, taskLoadFailed);
        };

        var tasksLoaded = function(response){
            $scope.tasks = response;
            // $scope.tasks.unshift({title: 'All projects - '});
            $scope.task = $scope.tasks[0];
            console.log(response);
        };

        var taskLoadFailed = function(response){};

        var loadEntries = function(userId){
            var dateRange = '';
            var project_id = '';

            if($scope.dateRange !== null){
                $rootScope.dateRange = Number($scope.dateRange.id);
                if($scope.dateRange.hasOwnProperty('key')){
                    dateRange = $scope.dateRange.key;
                }
            }

            if($scope.project !== null){
                $rootScope.project = getProjectID();
                $rootScope.projectpk = $scope.project.pk;
                if($scope.project.hasOwnProperty('pk')){
                    project_id = $scope.project.pk;
                }
            }else if($rootScope.projectpk > -1){
                project_id = $rootScope.projectpk;
            }

            entryService.GetEntries(userId, dateRange, project_id)
                .success(onEntriesLoaded)
                .error(onEntriesLoadFailed);
        };

        var getProjectID = function(){
            if($scope.project !== null){
                for(var index in $scope.projects){
                    if($scope.projects[index].title === $scope.project.title){
                        return Number(index);
                    }
                }
            }
            return -1;
        };

        var loadProjects = function(){
            projectService.GetUserProjects($rootScope.CurrentUser.id).then(projectsLoaded, projectsLoadFailed);
        }

        var projectsLoaded = function(response){
            $scope.projects = response;
            // $scope.projects.unshift({title: '- All projects -'});

            if(typeof $rootScope.project === 'undefined'){
                $scope.project = $scope.projects[0];
                $rootScope.project = 0;
            }else{
                $scope.project = $scope.projects[Number($rootScope.project)];
            }
        };

        var projectsLoadFailed = function(response){};

        var loadUsers = function(){
            userService.GetUsers().then(usersLoaded, userLoadFailed);
        };

        var usersLoaded = function(response){
            $scope.users = response;
            $scope.selectedUser = _.findWhere($scope.users, {id: $rootScope.CurrentUser.id});
        };

        var getOpenEntries = function(entries) {
            return entryService.GetUserOpenEntries();
        }

        var userLoadFailed = function(response){};

        var init = function(){
            var userId = $rootScope.CurrentUser.id;
            if(typeof $rootScope.dateRange === 'undefined'){
                $scope.dateRange = $scope.dateRangeTypes[3];
                $rootScope.dateRange = 3;
            }else{
                $scope.dateRange = $scope.dateRangeTypes[Number($rootScope.dateRange)];
            }

            loadProjects();
            loadTasks();
            loadUsers();

            if(typeof userId !== 'undefined')
            {
                loadEntries(userId);
            }
        };

        var getAllSelected = function () {
            var selectedItems = $scope.entries.filter(function (entry) {
               return entry.Selected;
            });

            return selectedItems.length === $scope.entries.length;
        };

        var setAllSelected = function (value) {
            angular.forEach($scope.entries, function (entry) {
                entry.Selected = value;
            });
        };

        $scope.submitEntry = function(entry){ };

        $scope.allSelected = function (value) {
            if (value !== undefined) {
               setAllSelected(value);
               return value;
            }

            return getAllSelected();
        };

        $scope.entriesForSubmission = function(){
            return $scope.entriesForSubmission.length > 0;
        };

        $scope.clearSubmissionEntries = function(){
            for(var i = $scope.entriesForSubmission.length - 1; i >= 0; i--) {
                $scope.entriesForSubmission.splice(i, 1);
            }
            $scope.submit = false;
        };

        $scope.Delete = function(){
            $scope.selectedItem.deleting = true;
            if($scope.selectedItem !== null){
                entryService.Delete($scope.selectedItem.id).then(entryDeleted, entryDeletionFailed);
            }
        };

        $scope.Edit = function(entry){
            entryService.EntrySelected(entry);
            $location.path('/editEntry');
        };

        $scope.Copy = function(entry){
            entryService.EntrySelected(entry);
            entryService.SetCopy(true);
            $location.path('/addEntry');
        };

        $scope.Change = function(){
            $rootScope.project = $scope.project;
            loadEntries($rootScope.CurrentUser.id);
        }

        $scope.GetTask = function(entry){
            return projectService.GetTask(entry.project_task_id);
        };

        $scope.submitOpenEntries = function() {
            var userId = $scope.selectedUser.id;
            entryService.Submit().then(loadEntries.bind(null, userId));
        };

        $scope.setSelectedEntry = function(entry) {
            $scope.selectedItem = entry;
        }

        $scope.selectAllEntries = function(){
            $scope.submit = !$scope.submit;
            setAllSelected(true);
        }

        $scope.submitSelectedEntries = function(){
            var userId = $rootScope.CurrentUser.id;

            var entryIds = [];
            angular.forEach($scope.entries, function (entry) {
                if(entry.Selected){
                    entryIds.push(entry.id);
                }
            });
            if(entryIds.length > 0){
                entryService.Submit(entryIds.join(',')).then(loadEntries.bind(null, userId));
                $scope.submit = false;
            }else{
                notificationService.error('No entries were selected.');
            }
        };

        init();
    });
