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
        GetEntriesByDuration: function(duration, userId) {
          var promise = jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl + '?user=' + userId +'&date_range='+ duration  , {});
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
  			GetEntriesForUser: function(userId){
          var promise = jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl + "?user=" +userId , {});
          promise.success(storeEntries);
  				return promise;
  			},
        Submit: function(entryIds){
          return jsonService.Post(HOURSSERVICE_BASE_URI, entryUrl + 'submit/', entryIds);
        }
  		};
  });
