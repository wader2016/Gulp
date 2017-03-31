'use strict';
// 获得数据
MetronicApp.controller('OrderPrepareController',['$scope','$http','ModelService','apiUrl','CommonService','SalesService', function ($scope,$http,ModelService,apiUrl,CommonService,SalesService) {

    CommonService.init($scope,false);
    $scope.SearchItem.Status = 16;
    $scope.searchCount.Status = 16;
    $scope.GetPageData($scope.SearchItem);
    var updateInfo = [];
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
        var item=[];
        if($scope.List.length>0){
            for(var i=0;i<$scope.List.length;i++){
                item.push($scope.List[i].Id);
            }
            var updateList = {
                "SalesId":$scope.salesId,
                "Status":32,
                "SalesOrderLineId":''
            };
            updateList.SalesOrderLineId =item.toString();
            SalesService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("仓库备货完成!");
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
        var updateList = {"SalesId":$scope.salesId,"Status":32,"SalesOrderLineId":$scope.list.Id};
        if($scope.list.Status=='16'){
            SalesService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("仓库备货完成!");
                $scope.list.Status='11';
            }, function () {
                alertInfo.Error("仓库备货失败!");
            })
        }
        else if($scope.list.Status=='11'){
            updateList.Status = 16;
            SalesService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("已取消仓库备货!");
                $scope.list.Status='16';
            })
        }
        updateInfo = [];
    };


}]);





