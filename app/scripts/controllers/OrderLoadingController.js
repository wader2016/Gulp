/**
 * Created by iTEC001 on 2015/7/27.
 */
'use strict';
MetronicApp.controller('OrderLoadingController',['$http','$scope','ModelService','apiUrl','CommonService','SalesService', function ($http,$scope,ModelService,apiUrl,CommonService,SalesService) {

    CommonService.init($scope,false);
    $scope.SearchItem.Status = 32;
    $scope.searchCount.Status = 32;
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
                "Status":64,
                "SalesOrderLineId":''
            };
            updateList.SalesOrderLineId =item.toString();
            SalesService.UpdateOrdersStatus(updateList).then(function () {
                alertInfo.Success("安排装柜成功!");
                for(var i=0;i<$scope.List.length;i++){
                    $scope.List[i].Status='31';
                }
            });


        }
    };
    $scope.Confirm = function () {
        var updateList = {"SalesId":$scope.salesId,"Status":64,"DocId":$scope.list.DocCode,"SalesOrderLineId":$scope.list.Id};
        if($scope.list.Status=='32'){
            SalesService.UpdateOrdersStatus(updateList).then(function () {
                $scope.list.Status='31';
                alertInfo.Success("安排装柜成功!");

            })
        }
        else if($scope.list.Status=='31'){
            updateList.Status = 32;
            SalesService.UpdateOrdersStatus(updateList).then(function () {
                $scope.list.Status='32';
                alertInfo.Success("取消安排装柜!");
            })
        }
    };


    //获得货运公司信息
    $http.get(apiUrl+'/api/v1/Sales/SalesOrders/Carrier').success(function (data) {
        $scope.shipCompany = data.Data;
    });

    $scope.getCompanyId= function (id,item) {
        $scope.shipCompanyId = id;
        $http.put(apiUrl+"/api/v1/Sales/SalesOrders/"+$scope.salesId+"/UpdateCarrier",{"SalesOrderLineId":item.Id,"CarrierAccountId":id}).success(function () {
            for(var i=0;i<$scope.shipCompany.length;i++){
                if($scope.shipCompany[i].Id==id){
                    item.shipCompanyName = $scope.shipCompany[i].Name;
                    item.companyId = id;
                }
            }
        }).error(function () {
            alertInfo.Error("失败");
        })
    };

    $scope.isShowTestModal = true;
    $scope.shippingConfirm= function () {
        if($scope.List.length>0){
            if(!angular.isDefined($scope.shipCompanyId)) {
                $scope.isShowTestModal = false;
                alertInfo.Error("请先选择货运公司!");
            }
        }
    };

    //模态框加载单个产品信息
    $scope.viewModel=function($index){
        $scope.isShowModal = true;
       if(angular.isDefined($scope.shipCompanyId)){
           $scope.list = $scope.listCount[$index];
       }
        else{
           $scope.isShowModal = false;
           alertInfo.Error("请先选择货运公司!");
       }

    };



}]);
