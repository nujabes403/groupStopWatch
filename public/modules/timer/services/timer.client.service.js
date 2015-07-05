'use strict';

angular.module('timer').factory('Timer', [
	function() {
		// Timer service logic
		// ...

        function secondsToHms(d) {
            d = Number(d);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);
            return (
            (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s
            );
        }

        function hmsToSeconds(hms){
            var tt = hms.split(':');
            var sec = 0;
            console.log(tt);
            if(tt.length == 3){
                sec = (parseInt(tt[0]) * 3600) + (parseInt(tt[1]) * 60) + (parseInt(tt[2])*1) ;
            } else{
                sec = parseInt(tt[0]) * 60 + parseInt(tt[1]) * 1;
            }
            return sec;
        }

        //function updateTimer(){
        //    secs+=1;
        //    $scope.timer.time = secondsToHms(secs);
        //}
        //
        //function runTimer(){
        //    if(!runTimer){
        //        updateTimer(secs);
        //        runTimer = $interval(updateTimer, 1000);
        //    }
        //    else{
        //        $interval.cancel(runTimer);
        //        runTimer = false;
        //    }
        //};
		// Public API
		return {
			secondsToHms: secondsToHms,
            hmsToSeconds: hmsToSeconds
			};

	}
]);
