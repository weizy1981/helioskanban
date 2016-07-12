


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
		alert("test");
        $http({
            method : 'POST',
            url : 'tasks/add',
            data : $scope.task,
            headers : {'Content-Type': 'application/json'}
        })
            .success(function(data){
				alert(data.status);
                if('OK' === data.status){
                    // $scope.result = data.message;
                    getSocket().emit('taskedit', {"_id":data.status});
                }
            })

			.error(function(data){
				alert("tttt");
            })
    }
});
