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

      return {
        EntrySelected: function(entry){
          selectedEntry = entry;
          selectedEntry.hours = parseFloat(entry.hours);
        },
        GetSelectedEntry: function(){
          return selectedEntry;
        },
        Copy: function(){
          return entryCopy;
        },
        SetCopy : function(copy){
          entryCopy = copy;
        },

        Add: function(entry){
          return jsonService.Post(HOURSSERVICE_BASE_URI, entryUrl, entry);
        },
        Edit: function(entry){
          return jsonService.Put(HOURSSERVICE_BASE_URI, entryUrl + entry.id + "/", entry);
        },
        Get: function(id){
          return jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl + id + "/", {});
        },
        Delete: function(id){
          return jsonService.Delete(HOURSSERVICE_BASE_URI, entryUrl + id + "/", {});
        },
        GetAll: function() {
          return jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl, {});
        },
        /**
         *This function does 4 types of entries fetching
         *1. By user id,
         *2. By user id && duration,
         *3. By user id && project_id,
         *3. By user id && project_id && duration
         */
        GetEntries: function(userId, duration, project_id) {
          debugger;
          if(notEmpty(project_id)){
            project_id = '&project_id='+ project_id
          }
          if(notEmpty(duration)){
            duration = '&date_range=' + duration;
          }
          var promise = jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl + '?user=' + userId + project_id + duration  , {});
          promise.success(storeEntries);
          return promise;
        },
        GetUserOpenEntries: function(){
          return _.filter(userEntries, function(entry) {
            return entry.status === 'Open';
          });
        },
        GetUserSubmittedEntries: function(){
          return _.reject(userEntries, function(entry) {
            return entry.status === 'Open' || entry.status === 'Deleted';
          });
        },
        Submit: function(entryIds){
          return jsonService.Post(HOURSSERVICE_BASE_URI, entryUrl + 'submit/', entryIds);
        }
      };
    });
