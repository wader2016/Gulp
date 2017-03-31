/**
 * Created by iTEC001 on 2015/8/10.
 */

// 获得数据
'use strict';
MetronicApp.controller('OrderShippingController',['$scope','$http','CommonService','SalesService', function ($scope,$http,CommonService,SalesService) {

    CommonService.init($scope,true);
    $scope.SearchItem.Status = 1;
    $scope.searchCount.Status = 1;
    $scope.GetPageData($scope.SearchItem);

}]);











