'use strict';

/**
 * @ngdoc overview
 * @name gulpApp
 * @description
 * # gulpApp
 *
 * Main module of the application.
 */

/* Metronic App */
var MetronicApp = angular.module("gulpApp", [
  "ui.router",
  "oc.lazyLoad",
  "ngSanitize",
  'LocalStorageModule',
  'angular-loading-bar',
  'ngFileUpload'
]);


MetronicApp.constant('apiUrl','http://58.221.60.50:9002/');

// 登录认证API
MetronicApp.constant('authUrl','http://58.221.60.50:9001/');

//图片头像API
MetronicApp.constant('staticFileServer', 'http://58.221.60.50:8888/');


MetronicApp.run(function($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
});

MetronicApp.run(['authService', function (authService) {
  authService.fillAuthData();
}]);

MetronicApp.config(function ($stateProvider, $urlRouterProvider,$httpProvider) {
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }
  //disable IE ajax request caching
  $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
  // extra
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
});

MetronicApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptorService');
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
  $ocLazyLoadProvider.config({
    cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
  });
}]);

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
  // supported languages
  var settings = {
    layout: {
      pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
    },
    layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
    layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
  };
  $rootScope.settings = settings;
  return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope','ModelService','SalesService','localStorageService','staticFileServer', function($scope,$rootScope,ModelService,SalesService,localStorageService,staticFileServer) {
  $scope.$on('$viewContentLoaded', function() {
    Metronic.initComponents(); // init core components
    //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
  });

  // 获得产品大类
  ModelService.getCategory().then(function (data) {
    $scope.catelog = data;
  });

  var userInfo = localStorageService.get("DRPUserInfo");
  if(userInfo){
    var contactInfo = JSON.parse(userInfo.ContactInfo)[0];
    $rootScope.UserImg = staticFileServer +contactInfo.StrExt2+'?'+Math.random();
  }

  // 监听用户修改头像
  $scope.$on("UserAvatar", function (e, data) {
    if(data){
      $rootScope.UserImg = data;
    }
  });


}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function($scope) {
  $scope.$on('$includeContentLoaded', function() {
    Demo.init(); // init theme panel
  });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
  $scope.$on('$includeContentLoaded', function() {
    Layout.initFooter(); // init footer
  });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
  // Redirect any unmatched url
  $urlRouterProvider.otherwise("/login.html");
  $stateProvider
      .state('login', {
        url: '/login.html',
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .state('signUp', {
        url: '/signUp.html',
        templateUrl: 'views/signUp.html',
        controller: 'SignUpController'
      })
    // Light Table
      .state('lightTable', {
        url: "/orders/lightTable.html",
        templateUrl: "views/lightTable.html",
        data: {pageTitle: '安排仓库备货', pageSubTitle: '业务安排'},
        controller: 'LightTableController'
      })
      .state('confirmReceipt', {
        url: "/orders/confirmReceipt.html",
        templateUrl: "views/confirmReceipt.html",
        data: {pageTitle: '收款确认', pageSubTitle: '财务'},
        controller: 'ConfirmReceiptController'
      })
      .state('orderLoading', {
        url: "/orders/orderLoading.html",
        templateUrl: "views/orderLoading.html",
        data: {pageTitle: '安排物流装柜', pageSubTitle: '选择物流公司'},
        controller: 'OrderLoadingController'
      })
      .state('orderPrepare', {
        url: "/orders/orderPrepare.html",
        templateUrl: "views/orderPrepare.html",
        data: {pageTitle: '仓库备货', pageSubTitle: '仓库捡货，自动产生销货单'},
        controller: 'OrderPrepareController'
      })
      .state('allOrder', {
        url: "/orders/allOrder.html",
        templateUrl: "views/allOrder.html",
        data: {pageTitle: '全部订单', pageSubTitle: ''},
        controller: 'AllOrderController'
      })
      .state('orderReceiving', {
        url: "/orders/orderReceiving.html",
        templateUrl: "views/orderReceiving.html",
        data: {pageTitle: '待收货订单查询', pageSubTitle: '付运单号'},
        controller: 'OrderReceivingController'
      })
      .state('orderFinish', {
        url: "/orders/orderFinish.html",
        templateUrl: "views/orderFinish.html",
        data: {pageTitle: '已收货订单查询', pageSubTitle: ''},
        controller: 'OrderFinishController'
      })
      .state('orderShipping', {
        url: "/orders/orderShipping.html",
        templateUrl: "views/orderShipping.html",
        data: {pageTitle: '待运送订单查询', pageSubTitle: ''},
        controller: 'OrderShippingController'
      })
      .state('productShipping', {
        url: "/orders/productShipping.html",
        templateUrl: "views/productShipping.html",
        data: {pageTitle: '打包装柜作业', pageSubTitle: '物流'},
        controller: 'ProductShippingController'
      })
      .state('orderRegister', {
        url: "/orders/orderRegister.html",
        templateUrl: "views/orderRegister.html",
        data: {pageTitle: '启运登记', pageSubTitle: ''},
        controller: 'OrderRegisterController'
      })
      .state('orderUnLoad', {
        url: "/orders/orderUnLoad.html",
        templateUrl: "views/orderUnLoad.html",
        data: {pageTitle: '物流到站卸货', pageSubTitle: ''},
        controller: 'OrderUnLoadController'
      })
      .state('deliverySearch', {
        url: "/orders/deliverySearch.html",
        templateUrl: "views/deliverySearch.html",
        data: {pageTitle: '在途运单查询', pageSubTitle: ''},
        controller: 'DeliverySearchController'
      })
      .state('deliveryFinish', {
        url: "/orders/deliveryFinish.html",
        templateUrl: "views/deliveryFinish.html",
        data: {pageTitle: '已结案运单查询', pageSubTitle: ''},
        controller: 'DeliveryFinishController'
      })
      .state('allDeliveryOrder', {
        url: "/orders/allDeliveryOrder.html",
        templateUrl: "views/allDeliveryOrder.html",
        data: {pageTitle: '全部运单查询', pageSubTitle: ''},
        controller: 'AllDeliveryOrderController'
      })
      .state('shippingDetail', {
        url: "/orders/shippingDetail.html",
        templateUrl: "views/shippingDetail.html",
        data: {pageTitle: '生成运单', pageSubTitle: '物流'},
        controller: 'ShippingDetailController'
      })
      .state('userProfile',{
        url:"/managements/userProfile",
        views:{
          '':{
            templateUrl:"views/userProfile.html"
          },
          'user_left@userProfile':{
            templateUrl: 'views/user_left.html'
          },
          'user_right@userProfile':{
            templateUrl: 'views/user_right.html'
          }
        },
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                "assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css" ,
                "assets/admin/pages/css/profile.css",
                "assets/admin/pages/css/tasks.css",
                "assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                "assets/global/plugins/jquery.sparkline.min.js" ,
                "commons/js/scripts/sparkline.js",
                'managements/controllers/UserProfileController.js'
              ]
            });
          }]
        }
      })
      .state('userProfile.accountSetting',{
        url:"/accountSetting",
        views:{
          'user_right@userProfile':{
            templateUrl: 'managements/views/accountSetting.html'
          }
        },
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                "assets/admin/pages/css/profile.css",
                "assets/admin/pages/css/tasks.css",
                "assets/global/plugins/select2/select2.css",
                "assets/global/plugins/bootstrap-datepicker/css/datepicker3.css",
                "assets/admin/pages/css/todo.css",
                'assets/admin/pages/css/image-crop.css',
                'commons/js/scripts/image-crop.js',
                'commons/js/scripts/GetInputFileUrl.js',

                "assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js",
                "assets/admin/pages/scripts/todo.js",
                "assets/global/plugins/select2/select2.min.js",
                'managements/controllers/AccountSettingController.js'
              ]
            });
          }]
        }
      })
      .state('userProfile.companySetting',{
        url:"/companySetting",
        views:{
          'user_right@userProfile':{
            templateUrl: 'managements/views/companySetting.html'
          }
        },
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                "assets/admin/pages/css/profile.css",
                "assets/admin/pages/css/tasks.css",
                "assets/global/plugins/select2/select2.css",
                "assets/global/plugins/bootstrap-datepicker/css/datepicker3.css",
                "assets/admin/pages/css/todo.css",

                "assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js",
                "assets/admin/pages/scripts/todo.js",
                "assets/global/plugins/select2/select2.min.js",
                'managements/controllers/CompanySettingController.js'
              ]
            });
          }]
        }
      })
      .state('userProfile.tasks',{
        url:"/tasks",
        views:{
          'user_left@userProfile':{
            templateUrl: 'managements/views/task_left.html'
          },
          'user_right@userProfile':{
            templateUrl: 'managements/views/task_right.html'
          }
        },
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                "assets/admin/pages/css/profile.css",
                "assets/admin/pages/css/tasks.css",
                "assets/global/plugins/bootstrap-datepicker/css/datepicker3.css",
                "assets/global/plugins/select2/select2.css",
                "assets/admin/pages/css/todo.css",
                "assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js",
                "assets/global/plugins/select2/select2.min.js",
                "assets/admin/pages/scripts/todo.js",
                'managements/controllers/TasksController.js'
              ]
            });
          }]
        }
      })
      .state('userProfile.help',{
        url:"/help",
        views:{
          'user_right@userProfile':{
            templateUrl: 'managements/views/help.html'
          }
        },
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                "assets/admin/pages/css/profile.css",
                "assets/admin/pages/css/tasks.css",
                'managements/controllers/HelpController.js'
              ]
            });
          }]
        }
      })

      .state('product', {
        url: "/managements/product.html",
        templateUrl: "managements/views/product.html",
        data:{pageTitle: '系统管理', pageSubTitle: '产品信息'},
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                "commons/css/product.css",
                "Common/css/product.css",
                "assets/frontend/layout/scripts/back-to-top.js",
                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                "assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js",
                "assets/global/scripts/linq.min.js",
                'managements/controllers/ProductController.js'
              ]
            });
          }]
        }
      })
      .state('price',{
        url:'/managements/price.html',
        templateUrl:'managements/views/price.html',
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                'commons/css/product.css',
                "Common/css/product.css",
                "assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css",
                'managements/controllers/PriceController.js'
              ]
            });
          }]
        }
      })
      .state('users', {
        url: "/managements/userInfo.html",
        templateUrl: "managements/views/userInfo.html",
        data:{pageTitle: '系统管理', pageSubTitle: '买家管理'},
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                "commons/css/product.css",
                "assets/admin/pages/css/profile.css",
                "assets/global/scripts/pagination.js",
                "assets/global/scripts/linq.min.js",
                'managements/controllers/UserInfoController.js'
              ]
            });
          }]
        }
      })
      .state('store', {
        url: "/managements/storeInfo.html",
        templateUrl: "managements/views/storeInfo.html",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                "commons/css/product.css",
                "Common/css/product.css",
                //"assets/admin/pages/css/profile.css",
                "assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js",
                'managements/controllers/StoreInfoController.js'
              ]
            });
          }]
        }
      })
      .state('InStock', {
        url: "/managements/InStock.html",
        templateUrl: "managements/views/InStock.html",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                "commons/css/product.css",
                "Common/css/product.css",
                "assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css",
                "assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js",
                'managements/controllers/InStockController.js'
              ]
            });
          }]
        }
      })
      .state('productCategory', {
        url: "/managements/productCategory.html",
        templateUrl: "managements/views/productCategory.html",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                "commons/css/product.css",
                "Common/css/product.css",
                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                "assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js",
                'managements/controllers/ProductCategoryController.js'
              ]
            });
          }]
        }
      })
      .state('AccountInfo', {
        url: "/managements/AccountInfo.html",
        templateUrl: "managements/views/AccountInfo.html",
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [
                "commons/css/product.css",
                "Common/css/product.css",
                "assets/global/scripts/linq.min.js",
                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                "assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js",
                'managements/controllers/AccountInfoController.js'
              ]
            });
          }]
        }
      })

      .state('analyse', {
        url: "/orders/analysis.html",
        templateUrl: "orders/views/analysis.html",
        data: {pageTitle: '销售', pageSubTitle: '销售战情看板'},
        resolve: {
          deps: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'MetronicApp',
              files: [

                //"assets/admin/pages/scripts/charts-flotcharts.js",
                "js/Charts.js",
                'orders/controllers/AnalyseController.js'
              ]
            });
          }]
        }
      })

}]);

MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope,settings,$state) {
  $rootScope.$state = $state;

}]);



