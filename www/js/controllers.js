angular.module('starter.controllers', [])


    .controller('ReflectionIndexCtrl', function ($scope, ReflectHttpAPI) {

        //Database connection and object handler for reflection list
        $scope.reflectionDb = ReflectHttpAPI.reflections();
        $scope.reflectionDb.$promise.then(function(data){
            $scope.reflections = data.json;
        });

        $scope.parseDate = function(dateString){
            return new Date(dateString);
        };

        //Helper to convert direction into class tag for styling
        $scope.parseDirection = function(directionString){
            if(angular.isNumber(directionString) && directionString === 1)
                return 'positiveReflection';
            else if (angular.isNumber(directionString) && directionString === -1)
                return 'negativeReflection';
            return '';
        };

    })


    //Controller for adding new reflection element
    .controller('ReflectionInsertCtrl', function ($scope, ReflectHttpAPI) {
        //DEFAULTS
        $scope.direction = 1; //positive reflection
        $scope.date = new Date(); //date = today

        //GETTER SETTER
        $scope.setDirection = function(num){
            if(typeof num != 'number'){
                num = parseInt(num);
            }

            $scope.direction = num;
        };

        $scope.getDate = function(idx){
            //lazy fetch
            if (!$scope.dates) {
                $scope.dates = [];
                for(var i=0; i<4; i++){
                    $scope.dates[i] = new Date();

                    if(i==0){
                        $scope.date = $scope.dates[i];
                    }

                    else{
                        $scope.dates[i].setDate($scope.dates[i-1].getDate() -1 );
                    }
                }
            }
            return $scope.dates[idx].valueOf();
        };

        $scope.setDate = function(idx){
            if (!$scope.dates) {
                $scope.getDate(0); //instantiation lazy
            }
            $scope.date = $scope.dates[idx];
        };

        //FORM HANDLER
        $scope.createReflection = function(reflection) {
            if(reflection.positive === true)
                reflection.direction = 1;
            else
                reflection.direction = -1;

            var newItem = ReflectHttpAPI;
            newItem.save({body: reflection.body, direction: $scope.direction, date: $scope.date.toString()},
                function(value, responseHeaders){
                    console.log('success saving');
                    reflection.body = "";

                }, function(httpResponse){
                    console.log('error saving, qeued item');
                }
            );
        };

        //HELPERS
        //Helper to parse tags from reflection body
        $scope.genTags = function(text){
            if(text && angular.isString(text)){
                var pattern = /#\w+/g;
                return text.match(pattern);
            }

        };

        //Helper to style currently selected direction
        $scope.styleDirection = function (idx) {
            if ($scope.direction != idx) return 'button-outline';
            else return '';
        };

        $scope.styleDate = function (idx) {
            if ($scope.date.valueOf() == $scope.getDate(idx)) return 'active';
            else return '';
        };
    });

