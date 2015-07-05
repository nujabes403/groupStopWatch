'use strict';

angular.module('fb').factory('fbUser', [
	function() {
		// fbUser service logic
		// ...
        var userInfo = {};
		// Public API
		return {
            setUserInfo:function(username){
                userInfo.username = username;
            },
            getUserInfo:function(){
                return userInfo;
            }
		};
	}
]);
