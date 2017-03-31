/**
 * Created by iTEC001 on 2015/8/31.
 */
'use strict';

MetronicApp.factory('ModelService',['$http','$q','apiUrl',function($http,$q,apiUrl){
    var service = {};
    service.getCategory = function () {
        var defer = $q.defer();
        $http.get(apiUrl+"api/v1/ProductCategory").success(function (data) {
           var category=data.Data;
            var catelog = [] ;
            for(var i=0;i< category.length;i++){
                if(category[i].ParentCode == 0){
                    category[i].module=[];
                    for(var j=0;j< category.length;j++){
                        if( category[j].ParentCode==category[i].Id){
                            category[i].module.push(category[j]);
                        }
                    }
                    catelog.push(category[i]);
                }
            }

            defer.resolve(catelog);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };

    return service;
}]);

MetronicApp.factory("SalesService",['$http','$q','apiUrl', function ($http,$q,apiUrl){
    var service = {};

    service.GetSalesInfo = function (salesInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+"/api/v1/Sales/Profile/SalesInfo",salesInfo).success(function (data) {
            var SalesInfo = data.Data;
            SalesInfo.StoreInfo = JSON.parse(SalesInfo.storeInfos);
            defer.resolve(SalesInfo);
        });

        return defer.promise;
    };

    service.UpdateOrdersStatus = function (updateInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+"/api/v1/me/SalesOrders/UpdateSalesOrderStatus",updateInfo).success(function (data) {
            defer.resolve(data.Data);
        });
        return defer.promise;
    };

    return service;

}]);

MetronicApp.factory("DeliveryService",['$http','$q','apiUrl', function ($http, $q, apiUrl) {
    var service = {};

    service.CreateDelivery = function (deliver) {
        var defer = $q.defer();
        $http.post(apiUrl+"/api/v1/Sales/SalesOrders/CreateDelivery",deliver).success(function (data) {
            defer.resolve(data.Data);
        });

        return defer.promise;
    };

    service.UpdateOrdersStatus = function (updateInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+"/api/v1/Sales/DeliveryOrder/updateStatus",updateInfo).success(function (data) {
            defer.resolve(data.Data);
        });
        return defer.promise;
    };

    return service;
}]);

MetronicApp.factory("AddressService",['$http','$q','apiUrl', function ($http, $q, apiUrl) {
    var service = {};
    service.AddAddressList = function (userId,AddressInfo) {
        var defer = $q.defer();
        $http.put(apiUrl+'api/v1/Address/'+userId+'/AddressInfo',AddressInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('新增失败');
        });
        return defer.promise;
    };
    service.SetDefaultAddressList = function (userId,addressId) {
        var defer = $q.defer();
        $http.put(apiUrl+'api/v1/Address/'+userId+'/Address/'+addressId).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('新增失败');
        });
        return defer.promise;
    };

    service.GetAddressInfo = function (userId) {
        var defer = $q.defer();
        $http.get(apiUrl+'api/v1/Address/GetAddressInfo/'+userId).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });
        return defer.promise;
    };

    service.DeleteAddressList = function (userId,addressId) {
        var defer = $q.defer();
        $http.delete(apiUrl+'api/v1/Address/'+userId+'/'+addressId).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('删除失败');
        });
        return defer.promise;
    };

    return service;

}]);

MetronicApp.factory("ExportService",['$http','$q','apiUrl', function ($http,$q,apiUrl) {
    var service = {};
    service.GetProducts = function (filterInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Excel/ListProducts',filterInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };
    service.ImportExcel = function (info) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Excel/ImportByExcel',info).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };
    service.ImportPriceToExcel = function (info) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Excel/ImportPriceToExcel',info).success(function (data) {
            defer.resolve(data.Data[0]);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };
    service.ImportStoreToExcel = function (info) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Excel/ImportStoreToExcel',info).success(function (data) {
            defer.resolve(data.Data[0]);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };
    service.ImportStockToExcel = function (info) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Excel/ImportStockToExcel',info).success(function (data) {
            defer.resolve(data.Data[0]);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };
    service.ImportAccountToExcel = function (info) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Excel/ImportAccountToExcel',info).success(function (data) {
            defer.resolve(data.Data[0]);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };

    service.ImportCatalogToExcel = function (info) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Excel/ImportCatalog',info).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };


    service.ExportToExcel = function (fileInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Excel/ExportProductToExcel',fileInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };
    service.ExportAccountToExcel = function (fileInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Excel/ExportAccountToExcel',fileInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };
    service.ExportCatalogToExcel = function (fileInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Excel/ExportCatalogToExcel',fileInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };



    return service;


}]);

MetronicApp.factory("ProductService",['$http','$q','apiUrl', function ($http,$q,apiUrl) {
    var service = {};

    service.GetProductCategory = function () {
        var defer = $q.defer();
        $http.get(apiUrl+'api/v1/ProductCategory').success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };
    // 获得产品大类
    service.GetProductCatalog = function (filterInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/ProductCatalog/GetCatalog',filterInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };
    service.UpdateProductCatalog = function (filterInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/ProductCatalog/UpdateCatalog',filterInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };
    service.SetProductCatalogActive = function (setInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/ProductCatalog/SetProductCatalogActive',setInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };

    service.GetProductPrice = function () {
        var defer = $q.defer();
        $http.get(apiUrl+'api/v1/Products/Price').success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败');
        });

        return defer.promise;
    };

    service.InsertOrUpdateProduct = function (productInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Products/ProductInfo',productInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('新增失败');
        });

        return defer.promise;
    };

    service.SetProductIsActive = function (setInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Products/SetProductIsActive',setInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('新增失败');
        });

        return defer.promise;
    };

    return service;

}]);

MetronicApp.factory("PriceService",['$http','$q','apiUrl', function ($http,$q,apiUrl) {
    var service = {};
    service.UpdateProductPrice = function (priceInfo) {
        var defer = $q.defer();
        $http.put(apiUrl+'api/v1/Products/UpdatePrice',priceInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('新增失败');
        });

        return defer.promise;
    };
    service.DeleteProductPrice = function (productId,userId) {
        var defer = $q.defer();
        $http.put(apiUrl+'api/v1/Products/DeletePrice/'+productId+"/"+userId).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('新增失败');
        });

        return defer.promise;
    };

    return service;

}]);

MetronicApp.factory("StoreService",['$http','$q','apiUrl', function ($http,$q,apiUrl) {
    var service = {};
    service.GetStoreInfo = function (userId) {
        var defer = $q.defer();
        $http.get(apiUrl+'api/v1/Store/StoreInfo/'+userId).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败!');
        });

        return defer.promise;
    };
    service.InsertOrUpdateStoreInfo = function (storeInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Store/InsertOrUpdateStoreInfo',storeInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败!');
        });

        return defer.promise;
    };
    service.DeleteStoreInfo = function (storeId) {
        var defer = $q.defer();
        $http.put(apiUrl+'api/v1/Store/DeleteStoreInfo/'+storeId).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败!');
        });

        return defer.promise;
    };

    return service;

}]);

MetronicApp.factory("StockService",['$http','$q','apiUrl', function ($http,$q,apiUrl) {
    var service = {};
    service.GetProductInStock = function (filterInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Stock/GetProductInStockList',filterInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败!');
        });

        return defer.promise;
    };

    service.ProductInStockInfo = function (Info) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Stock/ProductStockInfo',Info).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败!');
        });

        return defer.promise;
    };


    service.InsertOrUpdateStockInfo = function (stockInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Stock/InsertOrUpdateStocks',stockInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败!');
        });

        return defer.promise;
    };
    service.DeleteStoreInfo = function (Id) {
        var defer = $q.defer();
        $http.put(apiUrl+'api/v1/Stock/DeleteProductStocks/'+Id).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败!');
        });

        return defer.promise;
    };

    return service;

}]);

MetronicApp.factory("AccountService",['$http','$q','apiUrl', function ($http,$q,apiUrl) {
    var service = {};
    service.GetAccountList = function (filterInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/AccountInfo/GetAccountList',filterInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('获取失败!');
        });

        return defer.promise;
    };
    service.SetAccountIsActive = function (setInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/AccountInfo/SetAccountIsActive',setInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('更新失败!');
        });

        return defer.promise;
    };
    service.UpdateAccount = function (accountInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/AccountInfo/UpdateAccount',accountInfo).success(function (data) {
            defer.resolve(data.Data[0]);
        }).error(function () {
            defer.reject('更新失败!');
        });

        return defer.promise;
    };

    return service;

}]);

MetronicApp.factory("CompanyService",['$http','$q','apiUrl', function ($http,$q,apiUrl) {
    var service = {};
    service.GetCompanyInfo = function (userId) {
        var defer = $q.defer();
        $http.get(apiUrl+"/api/v1/Enterprise/"+userId).success(function (data) {
            defer.resolve(data.Data[0]);
        }).error(function () {
            defer.reject('获取失败!');
        });

        return defer.promise;
    };

    service.UpdateCompanyInfo = function (userId,companyInfo) {
        var defer = $q.defer();
        $http.post(apiUrl+'api/v1/Enterprise/'+userId+'/EnterpriseInfo',companyInfo).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('更新失败!');
        });

        return defer.promise;
    };

    service.SetDefaultContact = function (userId,contactId) {
        var defer = $q.defer();
        $http.put(apiUrl+'api/v1/Enterprise/'+userId+'/DefaultContact/'+contactId).success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('更新失败!');
        });

        return defer.promise;
    };

    service.DeleteContact = function (contactId) {
        var defer = $q.defer();
        $http.put(apiUrl+'api/v1/Enterprise/'+contactId+'/DeleteContact').success(function (data) {
            defer.resolve(data.Data);
        }).error(function () {
            defer.reject('删除失败!');
        });

        return defer.promise;
    };


    return service;
}]);