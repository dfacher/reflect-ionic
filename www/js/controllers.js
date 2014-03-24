angular.module('starter.controllers', [])


    .controller('ReflectionIndexCtrl', function($scope, ReflectHttpAPI, $ionicModal, $resource, $http) {

        $scope.reflectionDb = ReflectHttpAPI.reflections();
        $scope.reflectionDb.$promise.then(function(data){
            $scope.reflections = data.json;
        });

        $scope.parseDate = function(dateString){
            return new Date(dateString);
        };

        $scope.parseDirection = function(directionString){
            if(angular.isNumber(directionString) && directionString === 1)
                return 'positiveReflection';
            else if (angular.isNumber(directionString) && directionString === -1)
                return 'negativeReflection';
            return '';
        };

    })


 // Controller for adding new reflection element
    .controller('ReflectionInsertCtrl', function($scope, ReflectHttpAPI, $ionicModal, $resource, $http) {
        //DEFAULTS
        $scope.direction = 1;
        $scope.dates = [];
        $scope.date = $scope.dates[0];


        //GETTER SETTER
        $scope.setDirection = function(num){
            if(typeof num != 'number'){
                num = parseInt(num);
            }

            $scope.direction = num;
        }

        $scope.getDate = function(idx){
            if($scope.dates.length == 0){
                for(var i=0; i<4; i++){
                    $scope.dates[i] = new Date();
                    if(i>0){
                        $scope.dates[i].setDate($scope.dates[i-1].getDate() -1 );
                    }
                }
            }
            return $scope.dates[idx].valueOf();
        }

        $scope.setDate = function(idx){
            $scope.date = $scope.dates[idx].toString();
        }

        //STYLERS
        $scope.styleDirection = function(idx){
            if ($scope.direction != idx) return 'button-outline';
            else return '';
        }

        // Called when the form is submitted
        $scope.createReflection = function(reflection) {
            if(reflection.positive === true)
                reflection.direction = 1;
            else
                reflection.direction = -1;

            var newItem = ReflectHttpAPI;
            newItem.save({body: reflection.body, direction: $scope.direction, date: $scope.date},
                function(value, responseHeaders){
                    console.log('success saving');
                    reflection.body = "";

                }, function(httpResponse){
                    console.log('error saving, qeued item');
                }
            );
        };

        // TAG REGEX
        $scope.genTags = function(text){
            if(text && angular.isString(text)){
                var pattern = /#\w+/g;
                return text.match(pattern);
            }

        };
    })

