'use strict';

/**
* @ngdoc service
* @name hoursApp.entryservice
* @description
* # entryservice
* Service in the hoursApp.
*/

angular.module('hoursApp')
.service('entryService', function(jsonService, HOURSSERVICE_BASE_URI){

  var api = {};

  var entryUrl = '/api/v1/entry/';

  var selectedEntry = {};

  var userEntries = [];

  var entryCopy = false;

  var storeEntries = function(entries) {
    userEntries = entries;
  };

  var notEmpty = function(value){
    if(value !== '' && typeof value !== 'undefined' && value !== null){
      return true;
    }
    return false;
  };

  var makeSqlDateProperty = function(value){
      if(Number(value) < 10){
          return '0' + Number(value + 1)
      }
      return value
  } 

  var getMonthDateRange = function() {
      var now = moment();
      var startDate = moment([now.year(), now.month() - 1]);
      var endDate = moment(startDate).endOf('month');

      return { start: startDate.format('YYYY-MM-DD'), end: endDate.format('YYYY-MM-DD') };
  };

  api.EntrySelected = function(entry){
    selectedEntry = entry;
    selectedEntry.hours = parseFloat(entry.hours);
  };

  api.GetSelectedEntry = function(){
    return selectedEntry;
  };

  api.Copy = function(){
    return entryCopy;
  };

  api.SetCopy  = function(copy){
    entryCopy = copy;
  };

  api.Add = function(entry){
    return jsonService.Post(HOURSSERVICE_BASE_URI, entryUrl, entry);
  };

  api.Edit = function(entry){
    return jsonService.Put(HOURSSERVICE_BASE_URI, entryUrl + entry.id + "/", entry);
  };

  api.Get = function(id){
    return jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl + id + "/", {});
  };

  api.Delete = function(id){
    return jsonService.Delete(HOURSSERVICE_BASE_URI, entryUrl + id + "/", {});
  };

  api.GetAll = function() {
    return jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl, {});
  };
  /**
  *This function does 4 types of entries fetching
  *1. By user id,
  *2. By user id && duration,
  *3. By user id && project_id,
  *3. By user id && project_id && duration
  */
  api.GetEntries = function(userId, duration, project_id) {
    if(notEmpty(project_id)){
      project_id = '&project_id='+ project_id
    }
    if(notEmpty(duration)){
      if(duration === '5'){
        var dateRange = getMonthDateRange();
        duration = '&date_from='+dateRange.start+'&date_to='+dateRange.end;
      }else{
        duration = '&date_range=' + duration;
      }      
    }

    var promise = jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl + '?user=' + userId + project_id + duration  , {});
    promise.success(storeEntries);
    return promise;
  },

  api.GetUserOpenEntries = function(){
    return _.filter(userEntries, function(entry) {
      return entry.status === 'Open';
    });
  };

  api.GetUserSubmittedEntries = function(){
    return _.reject(userEntries, function(entry) {
     return entry.status === 'Open' || entry.status === 'Deleted';
    });
  };

  api.Submit = function(entryIds){
    return jsonService.Post(HOURSSERVICE_BASE_URI, entryUrl + 'submit/', entryIds);
  };

  return api;
});
