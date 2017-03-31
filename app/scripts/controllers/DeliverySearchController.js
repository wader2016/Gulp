/**
 * Created by iTEC001 on 2015/8/14.
 */
'use strict';
MetronicApp.controller('DeliverySearchController',['$http','$scope','CommonService',function ($http,$scope,CommonService) {

    CommonService.init($scope,true);
    $scope.SearchItem.Status = 2;
    $scope.searchCount.Status = 2;
    $scope.GetPageData($scope.SearchItem);


}]);