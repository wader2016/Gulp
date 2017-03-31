'use strict';
MetronicApp.controller('ProductShippingController',['$http','$scope','ModelService','$location','apiUrl','CommonService','SalesService', function ($http,$scope,ModelService,$location,apiUrl,CommonService,SalesService) {

    CommonService.init($scope,false);
    $scope.SearchItem.Status = 64;
    $scope.searchCount.Status = 64;
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
        var item=[];
        if($scope.List.length>0){
            for(var i=0;i<$scope.List.length;i++){
                item.push($scope.List[i].Id);
            }
            var updateList = {
                "SalesId":$scope.salesId,
                "Status":128,
                "SalesOrderLineId":''
            };
            updateList.SalesOrderLineId =item.toString();
            SalesService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("打包装柜成功!");
                for(var i=0;i<$scope.List.length;i++){
                    $scope.List[i].Status='64';
                }
            });


        }
    };
    //模态框加载单个产品信息
    $scope.viewModel=function($index){
        $scope.list = $scope.listCount[$index];
    };
    $scope.Confirm = function () {
        var updateList = {"SalesId":$scope.salesId,"Status":128,"DocId":$scope.list.DocCode,"SalesOrderLineId":$scope.list.Id};
        if($scope.list.Status=='64'){
            SalesService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("打包装柜成功!");
                $scope.list.Status='63';
            })
        }
        else if($scope.list.Status=='63'){
            updateList.Status = 64;
            SalesService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("已取消打包装柜!");
                $scope.list.Status='64';
            })
        }
    };


    //生成运单  跳转页面
    $scope.goToCheckOut= function () {
        $location.path('/orders/shippingDetail.html');
    };

}]);




