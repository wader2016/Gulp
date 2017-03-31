/**
 * Created by iTEC001 on 2015/8/10.
 */
'use strict';
// 获得数据
MetronicApp.controller('OrderReceivingController',['$scope','$http','CommonService', function ($scope,$http,CommonService) {

    CommonService.init($scope,false);
    $scope.SearchItem.Status = 256;
    $scope.searchCount.Status = 256;
    $scope.GetPageData($scope.SearchItem);

}]);

