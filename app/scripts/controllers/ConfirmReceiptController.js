/**
 * Created by iTEC001 on 2017/2/28.
 */
'use strict';
MetronicApp.controller("ConfirmReceiptController",['$scope','ModelService','localStorageService','CommonService','SalesService','$timeout', function ($scope,ModelService,localStorageService,CommonService,SalesService,$timeout) {
   $timeout(function () {
       CommonService.init($scope,false);
       $scope.SearchItem.Status = 2;
       $scope.searchCount.Status = 2;
       $scope.GetPageData($scope.SearchItem);
   },100);


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
        var item = [];
        if($scope.List.length>0){
            for(var i=0;i<$scope.List.length;i++){
                item.push($scope.List[i].Id);
            }
            var updateList = {
                "SalesId":$scope.salesId,
                "Status":4,
                "SalesOrderLineId":''
            };
            updateList.SalesOrderLineId =item.toString();

            SalesService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("已确认收款!");
                for(var i=0;i<$scope.List.length;i++){
                    $scope.List[i].Status='3';
                }
            });
        }
    };
    //模态框加载单个产品信息
    $scope.test=function($index){
        $scope.list = $scope.listCount[$index];
    };
    $scope.Confirm = function () {
        var updateList = {"SalesId":$scope.salesId,"Status":4,"DocId":$scope.list.DocCode,"SalesOrderLineId":$scope.list.Id};
        if($scope.list.Status=='2'){
            SalesService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("已确认收款!");
                $scope.list.Status='3';
            })
        }
        else if($scope.list.Status=='3'){
            updateList.Status = 2;
            SalesService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("已取消收款!");
                $scope.list.Status='2';
            })
        }
    };
}]);