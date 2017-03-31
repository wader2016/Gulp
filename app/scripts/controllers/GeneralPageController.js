
/* Setup general page controller */
'use strict';
MetronicApp.controller('GeneralPageController', ['$rootScope', '$scope', function($rootScope, $scope) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	Metronic.initAjax();
    });
}]);
