'use strict';

angular.module('core').controller('roomController', ['$scope','$stateParams','$interval','$firebaseAuth','$firebaseObject','$firebaseArray','fbRef','fbUser','$location','Timer',
	function($scope,$stateParams,$interval,$firebaseAuth,$firebaseObject,$firebaseArray,fbRef,fbUser,$location,Timer) {

        //Timer Status Set (Initial)
        var runTimer = false;
        var secs = 0;
        console.log("initial sec : " + secs);

        //User Set
        $scope.username = fbUser.getUserInfo().username;
        $scope.newUser = true;

        //Room (Make or Join)
        $scope.roomNum = $stateParams.roomNum;
        var roomNumRef = fbRef.getRoomRef($scope.roomNum);
        var roomUserRef = roomNumRef.child('users');

        roomNumRef.once('value',function(snapshot){
           if(snapshot.val()){
               console.log("이미 존재하는 방입니다. 기존의 " + $scope.roomNum +"번 방으로 들어갑니다.");
           } else{
               console.log($scope.roomNum + "번 방을 생성합니다.");
               console.log($scope.username +"님 환영합니다!");
               roomNumRef.set({roomNum:$scope.roomNum});
           }
            //Register Process
            roomUserRef.once('value',function(snapshot){
                //If Room already exist
                if(snapshot.val()) {
                    //Check Current User
                    for (var i = 0; i < snapshot.numChildren(); i++) {
                        if (snapshot.val()['user' + i].username == $scope.username) {
                            console.log("기존 유저입니다.");
                            $scope.newUser = false;
                            $scope.userId = 'user' + i;
                            var obj = $firebaseObject(roomUserRef.child($scope.userId));
                            var timeObj = $firebaseObject(roomUserRef.child($scope.userId).child('time'));
                            obj.$loaded().then(function () {
                                $scope.user1 = {
                                    username: obj.username,
                                    working: obj.working,
                                    role: obj.role
                                };
                                $scope.users = [$scope.user1];
                            });
                            timeObj.$loaded().then(function () {
                                console.log(timeObj);
                                console.log(timeObj.time);
                                secs = Timer.hmsToSeconds(timeObj.time);
                            });

                        }
                    }
                    //Register New User
                    if ($scope.newUser) {
                        if (snapshot.numChildren() == 4) {
                            alert("허용 인원 수를 초과하였습니다.");
                            $location.path('/');
                        } else {
                            $scope.userId = 'user' + snapshot.numChildren();
                            roomNumRef.child('users').child('user' + snapshot.numChildren()).set({
                                username: $scope.username,
                                role: 'user',
                                time: 0,
                                working: '없음'
                            });
                            var obj = $firebaseObject(roomUserRef.child($scope.userId));
                            var timeObj = $firebaseObject(roomUserRef.child($scope.userId).child('time'));
                            obj.$loaded().then(function () {
                                $scope.user1 = {
                                    username: obj.username,
                                    working: obj.working,
                                    role: obj.role
                                };
                                $scope.users = [$scope.user1];
                            });
                        }
                        //If Room doesn't exist
                    }
                }
                    else {
                        roomNumRef.child('users').child('user0').set({
                            username: $scope.username,
                            role: 'captain',
                            time: 0,
                            working: '없음'
                        });
                        console.log("새 방을 만드셨습니다. 당신이 방장입니다.");
                        $scope.userId = 'user0';
                        var obj = $firebaseObject(roomUserRef.child($scope.userId));
                        var timeObj = $firebaseObject(roomUserRef.child($scope.userId).child('time'));
                        obj.$loaded().then(function () {
                            $scope.user1 = {
                                username: obj.username,
                                working: obj.working,
                                role: obj.role
                            };
                            $scope.users = [$scope.user1];
                        });
                        secs = 0;
                    }

                    timeObj.$bindTo($scope, "timer");
                });

           });

        function updateTimer(){
            secs+=1;
            $scope.timer.time = Timer.secondsToHms(secs);
        }

        $scope.watchToggle = function(){
            console.log("later later sec : " + secs);
            if(!runTimer){
                updateTimer();
                runTimer = $interval(updateTimer, 1000);
            }
            else{
                $interval.cancel(runTimer);
                runTimer = false;
            }
        };
	}
]);
