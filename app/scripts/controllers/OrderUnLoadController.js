/**
 * Created by iTEC001 on 2015/8/14.
 */
'use strict';
MetronicApp.controller('OrderUnLoadController',['$scope','CommonService','DeliveryService', function ($scope,CommonService,DeliveryService) {

    CommonService.init($scope,true);
    $scope.SearchItem.Status = 2;
    $scope.searchCount.Status = 2;
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
        var DocCode=[];
        if($scope.List.length>0){
            for(var i=0;i<$scope.List.length;i++){
                DocCode.push($scope.List[i].DocCode);
            }
            var order = Enumerable.From(DocCode).Distinct().ToArray();
            for(var j=0;j<order.length;j++){
                var item =[];
                var updateList = {
                    "SalesId":$scope.salesId,
                    "Status":4,
                    "DeliveryId":'',
                    "DeliveryLIneId":''
                };
                for(var k=0;k<$scope.List.length;k++){
                    if(order[j] == $scope.List[k].DocCode){
                        item.push($scope.List[k].Id);
                    }
                }
                updateList.DeliveryId = order[j];
                updateList.DeliveryLIneId =item.toString();
                updateInfo.push(updateList);
            }
            DeliveryService.UpdateOrdersStatus(updateInfo).then(function () {
                alertInfo.Success("到站卸货成功!");
                for(var i=0;i<$scope.List.length;i++){
                    $scope.List[i].Status='12';
                }
                updateInfo = [];
            });

        }
    };
    //模态框加载单个产品信息
    $scope.test=function($index){
        $scope.list = $scope.listCount[$index];
    };
    $scope.Confirm = function () {
        var updateList = {"SalesId":$scope.salesId,"Status":4,"DeliveryId":$scope.list.DocCode,"DeliveryLIneId":$scope.list.Id};
        if($scope.list.Status=='2'){
            updateInfo.push(updateList);
            DeliveryService.UpdateOrdersStatus(updateInfo).then(function () {
                alertInfo.Success("到站卸货成功!");
                $scope.list.Status='12';
            })
        }
        else if($scope.list.Status=='12'){
            updateList.Status = 2;
            updateInfo.push(updateList);
            DeliveryService.UpdateOrdersStatus(updateInfo).then(function () {
                alertInfo.Success("取消卸货成功!");
                $scope.list.Status='2';
            })
        }
        updateInfo = [];
    };


}]);