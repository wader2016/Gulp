'use strict';
MetronicApp.controller('ShippingDetailController',['$http','$scope','$rootScope','$location','ModelService','apiUrl','CommonService','SalesService','DeliveryService', function ($http,$scope,$rootScope,$location,ModelService,apiUrl,CommonService,SalesService,DeliveryService) {
    CommonService.init($scope,false);
    $scope.SearchItem.Status = 128;
    $scope.searchCount.Status = 128;
    $scope.GetPageData($scope.SearchItem);

    // 单选
    $scope.checkBox = false;
    $scope.List=[];
    $scope.CheckElement = function (item,model) {
        if(model){
            $scope.List.push(item);
        }
        else{
            $scope.List.splice($scope.List.indexOf(item),1);
        }
    };
    //全选
    $scope.master=false;
    $scope.checkAll= function (flag) {
        $scope.List = [];
        if(flag==false){
            $scope.checkBox = true;
            for(var i=0;i<$scope.listCount.length;i++){
                $scope.List.push($scope.listCount[i]);
            }
        }
    };

    //模态框加载单个产品信息
    $scope.test=function($index){
        $scope.list = $scope.listCount[$index];
    };
    //单笔
    $scope.Confirm = function () {

        var updateList = {"SalesId":$scope.salesId,"Status":256,"SalesOrderLineId":$scope.list.Id};

        SalesService.UpdateOrdersStatus(updateList).then(function () {
            alertInfo.Success("运单生成成功!");
            $scope.list.Status = '127';
        });
    };

    // 生成运单
    $scope.crateDeliver = function () {
        var item =[];
        if($scope.List.length>0){
           for(var i=0;i<$scope.List.length;i++){
               item.push($scope.List[i].Id);
           }

           var updateList = {
               "SalesId":$scope.salesId,
               "Status":256,
               "SalesOrderLineId":''
           };
           updateList.SalesOrderLineId =item.toString();

        SalesService.UpdateOrdersStatus(updateList).then(function () {
            alertInfo.Success("运单生成成功!");
            for(var i=0;i<$scope.List.length;i++){
                $scope.List[i].Status='127';
            }
        });

       }
       else{
         alertInfo.Warning("请先选择需要生成的单据");
       }

    }

}]);