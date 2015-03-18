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

  		return {
  			EntrySelected: function(entry){
  				selectedEntry = entry;
  			},
  			GetSelectedEntry: function(){
  				return selectedEntry;
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
  				return jsonService.Delete(HOURSSERVICE_BASE_URI, entryUrl + id + "/", {})
  			},
  			GetAll: function(){
  				return jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl, {});
  			},
  			GetEntriesForUser: function(userId){
  				return jsonService.Get(HOURSSERVICE_BASE_URI, entryUrl + "?user:" +userId + "/", {});
  			}
  		}
  });
