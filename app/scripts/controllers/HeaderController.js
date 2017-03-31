/**
 * Created by iTEC001 on 2015/8/18.
 */
/* Setup Layout Part - Header */
'use strict';
MetronicApp.controller('HeaderController', ['$scope','$location','localStorageService','$rootScope','authService', function($scope,$location,localStorageService,$rootScope,authService) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });

    $scope.userInfo = localStorageService.get("DRPUserInfo");
    if($scope.userInfo !=null){
        $rootScope.Nick = $scope.userInfo.Abbr;
        $scope.Menu = JSON.parse($scope.userInfo.MenuList);
    }


    $scope.logOut = function () {
        authService.logOut();
        localStorageService.remove("DRPUserInfo");
        $location.path('/login.html').replace();
    };



}]);
