'use strict';

angular.module('fb').factory('fbRef', [
    function() {
        // fb ref service logic
        // ...
        var ref = new Firebase('https://blinding-inferno-7068.firebaseio.com/');
        var roomsRef = ref.child('rooms');
        var currentRoomRef = null;

        // Public API
        return {
            getRef: function() {
                return ref;
            },
            getRoomRef: function(roomNum){
                currentRoomRef = roomsRef.child(roomNum);
                return currentRoomRef;
            },
            getCurrentRoomRef:function(){
                return currentRoomRef;
            }
        };
    }
]);
