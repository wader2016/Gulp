/**
 * Created by iTEC001 on 2016/4/1.
 */
'use strict';
MetronicApp.controller("AnalyseController",['$scope','$http','apiUrl',function($scope,$http,apiUrl){
    var getAll = {
        "SalesId":"104355"
    };
    $http.put(apiUrl+"/api/v1/Sales/SalesOrders/GetAllOrders",getAll).success(function (data) {
        $scope.allOrders = data.Data;
        $scope.count = $scope.allOrders.length;
        $scope.totalPrice = 0;
        $scope.avgPrice = 0;
        for(var i=0;i<$scope.allOrders.length;i++){
            $scope.totalPrice +=$scope.allOrders[i].SalesPrice;
        }
        $scope.totalPrice = $scope.totalPrice.toFixed(2);
        if($scope.count>0){
            $scope.avgPrice =($scope.totalPrice/$scope.count).toFixed(2);
        }
    }).error(function () {
        console.log("error");
    });



}]);