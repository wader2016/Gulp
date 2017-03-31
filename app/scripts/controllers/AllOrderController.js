'use strict';
// 获得数据
MetronicApp.controller('AllOrderController',['$scope','$http','ModelService','apiUrl','CommonService','SalesService',function ($scope,$http,ModelService,apiUrl,CommonService,SalesService) {

    CommonService.init($scope,false);
    $scope.SearchItem.Status = '';
    $scope.searchCount.Status = '';
    $scope.GetPageData($scope.SearchItem);




}]);




