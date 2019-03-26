var app = angular.module('myApp', [
    'ngResource',
    'ui.router'
]);

app.config(['$resourceProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', function ($resourceProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
   // $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'website/home.html'
        })
        .state('subjects', {
            url: '/subjects',
            templateUrl: 'website/subjects.html'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'website/login.html'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'website/about.html'
        })
}]);
app.controller('mainController', ['$scope', '$state', function ($scope, $state) {
    $scope.changeRoute = function (router) {
        $state.go(router);
    }
}])

app.controller('loginController', ['$scope', 'loginFactoryMethod', function ($scope, loginFactoryMethod) {
    $scope.login = function () {
        var obj = {
            "type": "login",
            "email_address": $scope.email,
            "password": $scope.password
        }
        loginFactoryMethod.save(obj).$promise.then(function (res) {
            $scope.name = res;
        })
    }
}]).factory('loginFactoryMethod', ['$resource', function ($resource) {
    return $resource('http://localhost:8000/v1/user/login', {}, {
        save: { method: 'POST', headers: { 'content-type': 'application/json' }, isArray: false }
    });
}])
app.controller('homeController', ['$scope', 'firstService', 'cacheFactoryUsage', function ($scope, firstService, cacheFactoryUsage) {
    $scope.name = "async call resquest example";
    $scope.subjects = [];
    $scope.jobs = [];
    $scope.showData = function () {
        firstService.get().then(function (data) {
            console.log(data);
            $scope.subjects = data;
        });
    };

    firstService.post({
        name: 'angular',
        description: 'Its a framework'
    }).then(function (data) {
        $scope.info = data;
    });

    $scope.save = function () {
        cacheFactoryUsage.saveInfo($scope.cacheKey, $scope.cacheValue);
    }

    $scope.get = function () {
        $scope.cache = cacheFactoryUsage.getInfo(1);
    }
}]).service('firstService', ['$q', '$http', function ($q, $http) {
    this.get = function () {
        var d = $q.defer();
        $http({
            method: 'GET',
            url: 'http://localhost:8000/v1/subjects',
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (result) {
            d.resolve(result.data);
        })
        return d.promise;
    };
    this.post = function (info) {
        var d = $q.defer();
        $http({
            method: 'POST',
            url: 'http://localhost:8000/v1/subjects',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(info)
        }).then(function (result) {
            d.resolve(result.data);
        })
        return d.promise;
    }
}]).factory('cacheFactoryUsage', ['$cacheFactory', function ($cacheFactory) {
    var cacheVariable = $cacheFactory('siva');
    var saveInfo = function (key, value) {
        cacheVariable.put(key, value);
    }
    var getInfo = function (key) {
        return cacheVariable.get(key);
    }
    return {
        saveInfo: saveInfo,
        getInfo: getInfo
    }
}]);
app.controller('subjectsController', ['$scope', function ($scope) {
$scope.addTask = function(titale,value){
 console.log(titale,value);
   }

    $scope.subjects = [
        {
        "titale": "Javascript",
        "description": "What is JavaScript? JavaScript® (often shortened to JS) is a lightweight, interpreted, object-oriented language with first-class functions, and is best known as the scripting language for Web pages, but it's used in many non-browser environments as well."
    },
    {
        "titale": "C#",
        "description": "C# Developer Job Description Template. C# is a modern, general purpose, object-oriented programming language designed around the Common Language Infrastructure. ... The frameworks .Net and Mono combined allow a wide range of platforms to be targeted by applications developed with C#."
    },
    {
        "titale": "Java",
        "description": "A method in Java is a set of instructions that can be called for execution using the method name. A Java method can take in data or parameters and return a value - both parameters and return values are optional. Methods can be public, private or protected."
    },
    {
        "titale": "Python",
        "description": "Python is an easy to learn, powerful programming language. It has efficient high-level data structures and a simple but effective approach to object-oriented programming. Python’s elegant syntax and dynamic typing, together with its interpreted nature, make it an ideal language for scripting and rapid application development in many areas on most platforms."
    },
    {
        "titale": "ExpressJS",
        "description": "ExpressJS is bare-bones web application framework on top of NodeJS. It can be used to build WebApps, RESTFUL APIs etc quickly."
    },
    {
        "titale": "Node Js ",
        "description": "Node.js Developer Job Description Template. A Node.js developer is responsible for writing server-side web application logic in JavaScript and/or variants of it, such as CoffeeScript, IcedCoffeeScript, etc."
    },
    {
        "titale": "MongoDB",
        "description": "MongoDB is a cross-platform and open-source document-oriented database, a kind of NoSQL database. As a NoSQL database, MongoDB shuns the relational database's table-based structure to adapt JSON-like documents that have dynamic schemas which it calls BSON."
    },
    {
        "titale": "AngularJS",
        "description": "AngularJS is a structural framework for dynamic web apps. It lets you use HTML as your template language and lets you extend HTML's syntax to express your application's components clearly and succinctly. AngularJS's data binding and dependency injection eliminate much of the code you would otherwise have to write."
    }
    ]
}])