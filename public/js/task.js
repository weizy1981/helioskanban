


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
			},500);	
		}


    $http.get('/tasks/add').success(function(response) {
        $scope.systemNames = response.system_names;
        $scope.taskTypeIDs = response.task_types;
        //alert(response.members[0].user_name);
        var arrayObj = new Array();　
        for(var o in response.members){
            //alert(response.members[o].user_name);
            arrayObj.push(response.members[o].user_name);
        }
        $scope.owners = arrayObj;
        $scope.approvers = arrayObj;
        // $scope.owners = response.members;
        // $scope.approvers = response.members;
        $scope.totalWorks = ['Difficult','Normal','Easy'];
        // $scope.task.totalWork = $scope.totalWorks[0];
        $scope.task = {
            'totalWork': 'Normal'
            
        }
        $('#btn_add').attr('disabled',"true");
    })

    $scope.reset = function(){
        $scope.task = null;
        $scope.task ={
            'totalWork': 'Normal'
        }
    }
    
    $scope.add = function(){

        $http({
            method : 'POST',
            url : '/tasks/add',
            data : $scope.task,
            headers : {'Content-Type': 'application/json'}
        })
            .success(function(data){
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
