'use strict';

angular.module('core').controller('roomController', ['$scope','$stateParams','$interval','$firebaseAuth','$firebaseObject','$firebaseArray','fbRef','fbUser','$location','Timer',
	function($scope,$stateParams,$interval,$firebaseAuth,$firebaseObject,$firebaseArray,fbRef,fbUser,$location,Timer) {

        //Timer Status Set (Initial)
        var runTimer = false;
        $scope.timerStatus = false;
        var secs = 0;

        //User Set (Initial)
        $scope.username = fbUser.getUserInfo().username;
        $scope.newUser = true;
        $scope.users = [];

        //Room Set (Make or Join)
        $scope.roomNum = $stateParams.roomNum;
        var roomNumRef = fbRef.getRoomRef($scope.roomNum);
        var roomUserRef = roomNumRef.child('users');

        //Room Register Process
        roomNumRef.once('value',function(snapshot){
            //If a room already exist
           if(snapshot.val()){
               console.log("이미 존재하는 방입니다. " + $scope.roomNum +"번 방으로 들어갑니다.");
           }
           //If a room doesn't exist
           else{
               roomNumRef.set({roomNum:$scope.roomNum});
               console.log($scope.roomNum + "번 방을 생성합니다.");
               console.log($scope.username +"님 환영합니다!");
           }
            //User Register Process
            roomUserRef.once('value',function(snapshot){
                //If a room has an usersRef
                if(snapshot.val()) {
                    //Load Users
                    for (var i = 0; i < snapshot.numChildren(); i++) {
                        $scope.users.push(snapshot.val()['user' + i]);
                        console.log("$scope.user, username : " + $scope.users[i].username);
                    }
                    //Check User
                    for (var i = 0; i < snapshot.numChildren(); i++) {
                        //If an user is already exist in the room
                        if (snapshot.val()['user' + i].username == $scope.username) {
                            console.log("기존 유저입니다.");
                            $scope.newUser = false;
                            var userId = 'user' + i;
                            var timeObj = $firebaseObject(roomUserRef.child(userId).child('time'));
                            timeObj.$loaded().then(function () {
                                secs = Timer.hmsToSeconds(timeObj.time);
                            });

                        }
                    }
                    //If an user doesn't exist in the room ( when the user isn't a new user )
                    if ($scope.newUser) {
                        //If the room doesn't have an user slot (Full)
                        if (snapshot.numChildren() == 4) {
                            alert("허용 인원 수를 초과하였습니다.");
                            $location.path('/');
                        }
                        //If the room has an user slot (Not Full)
                        else {
                            var userId = 'user' + snapshot.numChildren();
                            roomUserRef.child(userId).set({
                                username: $scope.username,
                                role: 'user',
                                time: 0,
                                working: '없음'
                            },function(err){
                                if(err){
                                    console.log("Error");
                                } else{
                                    $scope.users.push({username:$scope.username,role:'user',time:0,working:'없음'});
                                    console.log($scope.users);
                                }
                            });
                            var timeObj = $firebaseObject(roomUserRef.child(userId).child('time'));
                        }
                    }
                }   //If a room doesn't have an usersRef
                    else {
                        roomNumRef.child('users').child('user0').set({
                            username: $scope.username,
                            role: 'captain',
                            time: 0,
                            working: '없음'
                        });
                        $scope.users.push({username:$scope.username,role:'captain',time:0,working:'없음'});
                        console.log("당신이 방장입니다.");
                        var userId = 'user0';
                        var timeObj = $firebaseObject(roomUserRef.child(userId).child('time'));
                        secs = 0;
                    }

                    timeObj.$bindTo($scope, "timer");
                    roomUserRef.on('value',function(snapshot){
                    for(var i = 0 ; i < snapshot.numChildren() ; i++){
                        $scope.users[i] = snapshot.val()['user'+i];
                    }
                });
                });

           });

        function updateTimer(){
            secs+=1;
            // 3 way data binding $scope.timer.time <-> Firebase obj time property
            $scope.timer.time = Timer.secondsToHms(secs);
        }

        $scope.watchToggle = function(){
            console.log("later later sec : " + secs);
            if(!runTimer){
                    updateTimer();
                    runTimer = $interval(updateTimer, 1000);
                    $scope.timerStatus = true;
            }
            else{
                    $interval.cancel(runTimer);
                    runTimer = false;
                    $scope.timerStatus = false;
            }
        };
	}
]);
