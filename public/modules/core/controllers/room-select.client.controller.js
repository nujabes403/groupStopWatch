'use strict';

angular.module('core').controller('roomSelectController', ['$scope','$location',
	function($scope,$location) {
        // Room select controller logic
        // ...
        $scope.joinRoom = function (room) {
            $location.path('/room/' + room);
        };
    }
]);
