angular.module('myApp',[]).controller('tasksCtrl', function($scope, $http){

    $http.get('/tasks/add').success(function(response) {
        $scope.systemNames = ["a","b"];
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
                if('OK' === data.status){
                    $scope.result = data.message;    
                }
            })
    }
});
