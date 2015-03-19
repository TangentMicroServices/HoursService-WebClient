/**
  * NOTE: This file will be replaced at deploy time. 
  * Make sure that any variables in here are also handled in your deploy script. 
  *
  * NOTE: _ALL_ service urls will automatically be put in here in the format: 
  * .constant('{{SERVICE_NAME|upper}}_BASE_URI', "http://correcturlgoeshere.com")
  */

angular.module('hoursApp')
  .constant('USERSERVICE_BASE_URI', "http://userservice.staging.tangentmicroservices.com")
  .constant('HOURSSERVICE_BASE_URI', "http://hoursservice.staging.tangentmicroservices.com")
  .constant('PROJECTSERVICE_BASE_URI', "http://projectservice.staging.tangentmicroservices.com");