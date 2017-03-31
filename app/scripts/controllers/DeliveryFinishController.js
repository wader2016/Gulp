/**
 * Created by iTEC001 on 2015/8/14.
 */
'use strict';
MetronicApp.controller('DeliveryFinishController',['$scope','CommonService',function ($scope,CommonService) {

    CommonService.init($scope,true);
    $scope.SearchItem.Status = 8;
    $scope.searchCount.Status = 8;
    $scope.GetPageData($scope.SearchItem);

}]);