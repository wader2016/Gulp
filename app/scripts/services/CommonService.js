/**
 * Created by iTEC001 on 2016/12/1.
 */
'use strict';

MetronicApp.factory("CommonService",['$http','$q','apiUrl','$filter','localStorageService',function ($http,$q,apiUrl,$filter,localStorageService) {
    var service = {init:InitPage};

    function InitPage($scope,state){
        // 收起/显示菜单
        $scope.isShowList=true;
        $scope.ShowList=function(){
            $scope.isShowList = ! $scope.isShowList;
        };
        //折叠 更多/收起
        $scope.isShow=true;
        $scope.packUpDown= function () {
            $scope.isShow = ! $scope.isShow;
        };

        $scope.SalesInfo = localStorageService.get("DRPUserInfo");
        if($scope.SalesInfo !=null){
            $scope.salesId = $scope.SalesInfo.Id;
            $scope.StoreId = $scope.SalesInfo.StoreId;
        }

        $scope.DateFrom = moment().subtract(30,'days').format("YYYY-MM-DD");
        $scope.DateTo   = moment().format("YYYY-MM-DD");

        $scope.SearchItem = {
            "SalesId":$scope.salesId,
            "DocId":'',
            "DateFrom":'',
            "DateTo":'',
            "Status":'',
            "ProductCode":'',
            "CategoryId":'',
            "StoreId":'',
            "AreaId":'',
            "OrderBy":'',
            "PageIndex":1,
            "pageSize":10
        };

        $scope.searchCount = {
            "SalesId":$scope.salesId,
            "DocId":'',
            "DateFrom":'',
            "DateTo":'',
            "Status":'',
            "ProductCode":'',
            "CategoryId":'',
            "StoreId":'',
            "AreaId":'',
            "OrderBy":'',
            "PageIndex":'',
            "pageSize":''
        };

        $scope.TotalNumbs = 0;
        $scope.TotalPages = 0;
        $scope.currentPage = 1;
        $scope.pageRangestart = 1;
        $scope.pageRangeEnd = 10;
        $scope.pageSize = 10;

        $scope.GetCount = function (searchCount) {
            if(state){
                $http.post(apiUrl+"/api/v1/Sales/DeliveryOrder/GetDeliveryOrder",searchCount).success(function (data) {
                    $scope.TotalNumbs = data.Data.length;
                    //if($scope.TotalNumbs<$scope.pageRangeEnd){
                    //    $scope.pageRangeEnd = $scope.TotalNumbs;
                    //}
                    $scope.TotalPages = Math.ceil($scope.TotalNumbs/$scope.pageRangeEnd);
                });
            }
            else{
                $http.post(apiUrl+"/api/v1/Sales/SalesOrders/GetSalesOrders",searchCount).success(function (data) {
                    $scope.TotalNumbs = data.Data.length;
                    $scope.TotalPages = Math.ceil($scope.TotalNumbs/$scope.pageRangeEnd);
                });
            }
        };


        //搜索
        $scope.searchList= function () {
            $scope.SearchItem.DateFrom = $scope.DateFrom;
            $scope.searchCount.DateFrom = $scope.DateFrom;
            $scope.SearchItem.DateTo   = $scope.DateTo;
            $scope.searchCount.DateTo   = $scope.DateTo;
            $scope.GetPageData($scope.SearchItem);
        };


        //产品大类选择
        $scope.checkListItem=[];
        $scope.checkItems= function (item) {
            if($scope.checkListItem.indexOf(item.Id)<0){
                $scope.checkListItem.push(item.Id);
            }
            else{
                $scope.checkListItem.splice($scope.checkListItem.indexOf(item.Id),1);
            }
            $scope.SearchItem.CategoryId = $scope.checkListItem.toString();
            $scope.searchCount.CategoryId = $scope.checkListItem.toString();
            $scope.GetPageData($scope.SearchItem);
        };
        //仓库选择
        $scope.checkStoreItem=[];
        $scope.checkStore= function (item) {
            if($scope.checkStoreItem.indexOf(item.StoreId)<0){
                $scope.checkStoreItem.push(item.StoreId);
            }
            else{
                $scope.checkStoreItem.splice($scope.checkStoreItem.indexOf(item.StoreId),1);
            }
            $scope.SearchItem.StoreId = $scope.checkStoreItem.toString();
            $scope.GetPageData($scope.SearchItem);
        };

        //不限
        $scope.allList= function () {
            $scope.SearchItem.CategoryId = '';
            $scope.checkListItem=[];
            $("input").attr('checked',false);
            $scope.GetPageData($scope.SearchItem);
        };

        $scope.privPage = function () {
            if($scope.currentPage>1){
                $scope.currentPage -=1;
                $scope.pageRangestart = ($scope.currentPage-1)*$scope.pageSize+1;
                $scope.pageRangeEnd = $scope.currentPage * $scope.pageSize;

                $scope.SearchItem.PageIndex = $scope.currentPage;
            }
            $scope.GetPageData($scope.SearchItem);
        };

        $scope.nextPage = function () {
            if($scope.currentPage<$scope.TotalPages){
                $scope.currentPage ++;
                $scope.pageRangestart = ($scope.currentPage-1)*$scope.pageSize+1;
                var pageRangeEnd=$scope.currentPage*$scope.pageSize;
                if(pageRangeEnd>=$scope.TotalNumbs){
                    $scope.pageRangeEnd = $scope.TotalNumbs;
                }else{
                    $scope.pageRangeEnd =pageRangeEnd
                }

                $scope.SearchItem.PageIndex = $scope.currentPage;
            }

            $scope.GetPageData($scope.SearchItem);


        };


        $scope.GetPageData = function (searchInfo) {
            if(state){
                $scope.GetDeliveryOrderData(searchInfo);
            }
            else{
                $scope.GetSalesOrderData(searchInfo);
            }

            var Info = {"FilterJson":JSON.stringify($scope.searchCount)};
            $scope.GetCount(Info);
        };

        $scope.GetSalesOrderData = function(searchInfo){

            var searchList = {"FilterJson":JSON.stringify(searchInfo)};
            $http.post(apiUrl+"/api/v1/Sales/SalesOrders/GetSalesOrders",searchList).success(function (data) {
                $scope.listCount = data.Data;
                for(var i = 0;i<$scope.listCount.length;i++){
                    if(ISCanToJson($scope.listCount[i].BuyerContactInfo)){
                        $scope.listCount[i].BuyerContactInfo = JSON.parse($scope.listCount[i].BuyerContactInfo)
                    }
                }
            });
        };

        $scope.GetDeliveryOrderData = function (searchInfo) {
            var searchList = {"FilterJson":JSON.stringify(searchInfo)};
            $http.post(apiUrl+"/api/v1/Sales/DeliveryOrder/GetDeliveryOrder",searchList).success(function (data) {
                $scope.listCount = data.Data;
                for(var i = 0;i<$scope.listCount.length;i++){
                    if(ISCanToJson($scope.listCount[i].ConsigneerContactInfo)){
                        $scope.listCount[i].ConsigneerContactInfo = JSON.parse($scope.listCount[i].ConsigneerContactInfo)
                    }
                }
            });
        };

        function ISCanToJson(str){
            try{
                 var s = JSON.parse(str);
                return true;
            }
            catch(e){
                return false;
            }
        }

    };

    return service;
}]);