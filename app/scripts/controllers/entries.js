'use strict';

/**
* @ngdoc function
* @name hoursApp.controller:ViewentriesCtrl
* @description
* # ViewentriesCtrl
* Controller of the hoursApp
*/
angular.module('hoursApp')
.controller('EntriesCtrl', function ($timeout, $scope, $filter, $rootScope, $location, notificationService, userService, entryService, projectService) {
  $scope.loaded = false;
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

  $scope.slide = function (dir) {
    $('#task-carousel').carousel(dir);
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
  var currentCell, rowIndex, cellIndex = null; // active cell info


  $scope.addTask = function() {
    $scope.entriesByTask['new'] = [];
  }

  $scope.revealCommentBox = function(event) {
    stickyNote.style.display = "block";
    stickyNote.style.left = event.pageX + "px";
    stickyNote.style.top = event.pageY + "px";

    currentCell = $(event.currentTarget).parent().parent();
    cellIndex = currentCell[0].cellIndex - 1;

    rowIndex = $(currentCell[0]).parent()[0].rowIndex - 1;
    var project_task_id = $("#calendar tbody tr:eq("+ rowIndex +") td:eq(0) .selectize-dropdown-content .selected").data("value")
    var entries = $filter('filter')($scope.entriesByTask[project_task_id], {day: moment($scope.days[cellIndex]).format("YYYY-MM-DD") })

    angular.forEach(entries, function(entry) {
      stickyNoteTextarea.value =  entry.comments;
      $(stickyNote).data('entry', entry);
      if (entry.status === "Submitted") {
          $(stickyNote).find('.btn').css("display", "None");
          $(stickyNoteTextarea).attr('disabled', true);
      } else {
          $(stickyNote).find('.btn').css("display", "block");
          $(stickyNoteTextarea).attr('disabled', false);
      }
    });
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

  $scope.saveEntry = function() {
    if(stickyNote.style.display){

      stickyNote.style.display = 'none';

      // check if an entry exists
      var entry = $('.sticky-note').data('entry') || null;

      if(entry) {
        entry.comments = stickyNoteTextarea.value || entry.comments;
        entry.day = new moment(entry.day).format("YYYY-MM-DD");

        // update the entry
        entryService.Edit(entry)
        .then(entryUpdated, entryDidNotUpdate);
      } else {
        // put the comment together
        var hours = currentCell.find('input').val();
        var comment = stickyNoteTextarea.value;
        var day = moment($scope.days[cellIndex]).format("YYYY-MM-DD");
        var task_id = $("#calendar tbody tr:eq("+ rowIndex +") td:eq(0) .selectize-dropdown-content .selected").data("value")
        var project_id = $filter('filter')($scope.tasks, {id: task_id })[0].project;

        // validate the new entry... can be done better
        if(hours > 0 && comment.length > 0 && day.length > 0, task_id > 0, project_id > 0) {
           createNewEntry(hours, comment, day, project_id, task_id);
        }
      }
      $scope.project_tasks = [];
    }
  };

  projectService.MyTasks().then(function(data){
    $scope.myTasks = data;
    angular.forEach($scope.myTasks, function(task, key) {
      task.project_title = task.project_data.title;
    });
  });

  $scope.selectizeConfig = {
    valueField: 'id',
    labelField: 'title',
    searchField: ['title', 'project_title'],
    create: false,
    maxItems: 1,
    render: {
      item: function(item, escape) {
        return '<div>' +
        (item.title ? '<span class="name">' + escape(item.project_data.title) + '</span> - ' : '') +
        (item.project_data.title ? '<span class="email">' + escape(item.title) + '</span>' : '') +
        '</div>';
      },

      option: function(item, escape) {
        var label = item.title || item.project_data.title;
        var caption = item.title ? item.project_data.title : null;
        return '<div>' +
        '<span class="opt-title">' + escape(label) + '</span>' +
        (caption ? '<span class="opt-project">' + escape(caption) + '</span>' : '') +
        '</div>';
      }
    },
    onChange: function(selectedIndex) {
      rename($scope.entriesByTask, "new", selectedIndex );
    },
    onInitialize: function(selectize) {
      projectService.MyTasks().then(function(data){

        selectize.addOption(data)
      }, taskLoadFailed);
    }
  };

  function rename(obj, oldName, newName) {
    if(!obj.hasOwnProperty(oldName)) {
      return false;
    }

    obj[newName] = obj[oldName];
    delete obj[oldName];
    return true;
  }

  var createNewEntry = function(hours, comments, day, project_id, task_id){

    var newEntry = {
      id: null,
      user: $rootScope.CurrentUser.id,
      project_id: project_id,
      project_task_id: task_id,
      status: 'Open',
      day: day,
      start_time: '08:00:00',
      end_time: '17:00:00',
      comments: comments,
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

  $scope.uiTasks = [];

  var populateEntries = function () {
    // console.log($scope.projects)
    var row = angular.element(document.querySelectorAll('#calendar input'));

    // clear all the inputs
    for (var i = 0; i < row.length; i++) {
      row[i].value = "";
      angular.element(row[i]).trigger('input');
    }

    var start_filter_date = moment(Date.parse($scope.days[0])).format("YYYY-MM-DD");
    var end_filter_date = moment(Date.parse($scope.days[6])).format("YYYY-MM-DD");
    var current_week_entries  = $filter('dateRange')($scope.entries, start_filter_date, end_filter_date, true);

    $scope.entriesByTask = _.groupBy(current_week_entries, 'project_task_id');
    angular.forEach($scope.entriesByTask, function(task, task_id, context){
      angular.forEach(_.groupBy(task, 'day'), function(dayEntries, date) {
        var dayIndex = moment(date).day()-1;
        $scope.dailyTotals[dayIndex][task_id] = Number(dayEntries[0].hours);

        if(dayEntries[0].status === 'Submitted') {

          $("#calendar tbody tr:eq("+ Object.keys(context).indexOf(task_id) +") td:eq("+ (dayIndex+1) +") .fa-sticky-note").addClass('submitted');
        }

      });
    });
  };

  $scope.closeNote = function () {
      stickyNote.style.display = 'none';
      $(stickyNoteTextarea).val(null);
      $(stickyNote).data('entry', null);
      currentCell = null;
  };

  window.onkeydown = function( event ) {
    if ( event.keyCode === 27 ) {
      $scope.closeNote();
    }
  };

  $scope.colors = ['#D0DD2B', '#98C73D', '#00A9E0', '#67CDDC', '#3B3B3D'];

  $scope.fireEvent = function() {
    $timeout(function(){
      $scope.$watch('[entries, projects, days, myTasks]', function() {
        populateEntries();
      }, true);
    }, 0);
  }

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
    // console.log(response);
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
