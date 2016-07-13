


angular.module('myApp',[]).controller('tasksCtrl', function($scope, $http){

		var socket = io();	
		socket.on('messages', function(msgObj){
			if (msgObj._id==null || msgObj._id==undefined) {
			} else {
				refreshPage();
			}
		});
		function getSocket(){
			if(socket==null || socket==undefined){
				socket = io();
			}
			return socket;
		}

		function refreshPage() {
			setTimeout(function(){
				window.location.reload();
			},5000);	
		}


    $http.get('/tasks/add').success(function(response) {
        $scope.systemNames = response.system_names;
        $scope.taskTypeIDs = response.task_types;
    })

    $scope.reset = function(){
        $scope.task = null;
    }
    
    $scope.add = function(){

        $http({
            method : 'POST',
            url : 'add',
            data : $scope.task,
            headers : {'Content-Type': 'application/json'}
        })
            .success(function(data){
				alert(data.status);
                if('OK' === data.status){
                    //alert("OK");
                    // $scope.result = data.message;
                    
                    $('.theme-popover-mask').fadeOut(100);
		            $('.theme-popover').slideUp(200);
                    getSocket().emit('taskedit', {"_id":data.status});
                }
                else{
                    alert("NG");
                }
            })
			.error(function(data){
				alert("error");
            })

    }
});
