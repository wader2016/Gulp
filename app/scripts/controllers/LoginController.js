/**
 * Created by iTEC001 on 2015/9/14.
 */
'use strict';
MetronicApp.controller('LoginController',['$scope','$location','$rootScope','authService','$http','apiUrl','localStorageService', function ($scope, $location,$rootScope, authService,$http,apiUrl,localStorageService) {

    if(authService.authentication.isAuth==true){
        $location.url('/orders/lightTable.html');
    }
    else{
        authService.logOut();
    }
    $scope.loginData = {
        userName: "",
        password: ""
    };
    $scope.message = "";
    $scope.login = function () {
        authService.login($scope.loginData)
            // 登录成功
            .then(function (response) {
                $http.post(apiUrl+"/api/v1/UserProfile/DRP",{"userName":response.userName}).success(function (data) {
                    if(data.Data[0].Id==-1){
                        authService.authentication.isAuth = false;
                        authService.logOut();
                        alertInfo.Error(data.Data[0].Code);
                        return;
                    }
                    authService.authentication.isAuth = true;
                    authService.authentication.userName = response.userName;
                    $scope.userProfile = data.Data[0];
                    localStorageService.set("DRPUserInfo",$scope.userProfile);
                    $location.path('/orders/lightTable.html').replace();
                    window.location.href = "#/orders/lightTable.html";
                    window.location.reload(true);
                })
            .error(function () {
                authService.logOut();
                alertInfo.Error("登录失败!");
            })

            },
            function (err) {
                $scope.message = err.error_description;
            }
    );
    };


}]);