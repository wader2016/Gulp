/**
 * Created by iTEC001 on 2015/8/3.
 */
'use strict';
MetronicApp.controller('OrderRegisterController',['$http','$scope','CommonService','DeliveryService', function ($http,$scope,CommonService,DeliveryService) {

    CommonService.init($scope,true);
    $scope.SearchItem.Status = 1;
    $scope.searchCount.Status = 1;
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
    //全选 备货确认
    $scope.stuckConfirm=function() {
        var item =[];
        var updateList = {
            "SalesId":$scope.salesId,
            "Status":2,
            "DeliveryOrderLineId":""
        };
        if($scope.List.length>0){
            for(var i=0;i<$scope.List.length;i++){
                item.push($scope.List[i].Id);
            }
            updateList.DeliveryOrderLineId =item.toString();
            DeliveryService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("启运登记成功!");
                for(var i=0;i<$scope.List.length;i++){
                    $scope.List[i].Status='11';
                }
            });

        }
    };
    //模态框加载单个产品信息
    $scope.test=function($index){
        $scope.list = $scope.listCount[$index];
    };
    $scope.Confirm = function () {
        var updateList = {"SalesId":$scope.salesId,"Status":2,"DeliveryOrderLineId":$scope.list.Id};
        if($scope.list.Status=='1'){
            DeliveryService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("启运登记成功!");
                $scope.list.Status='11';
            })
        }
        else if($scope.list.Status=='11'){
            updateList.Status = 1;
            DeliveryService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("取消登记成功!");
                $scope.list.Status='1';
            })
        }
    };
}]);

