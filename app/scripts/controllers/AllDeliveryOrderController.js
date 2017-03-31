'use strict';

MetronicApp.controller('AllDeliveryOrderController',['$scope','CommonService',function ($scope, CommonService) {

    CommonService.init($scope,true);
    $scope.GetPageData($scope.SearchItem);

}]);