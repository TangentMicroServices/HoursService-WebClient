'use strict';

angular.module('hoursApp')
.filter('dateRange', function() {
   return function(input, startDate, endDate) {
      var retArray = [];

      angular.forEach(input, function(obj){
        var receivedDate = obj.day;
        if(moment(receivedDate).isBetween(startDate, endDate) ||
          moment(receivedDate).isSame(startDate) || 
          moment(receivedDate).isSame(endDate) ){
          retArray.push(obj);
        }

      });

      return retArray;
   };
});
