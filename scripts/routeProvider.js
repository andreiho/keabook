// Configuring the route provider
keabookApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html',
      controller: 'keabookCtrl'
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'keabookCtrl'
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'keabookCtrl'
    })
    .when('/myprofile', {
      templateUrl: 'partials/myprofile.html',
      controller: 'keabookCtrl'
    })
    .when('/users/:uid', {
      templateUrl: 'partials/profile.html',
      controller: 'keabookCtrl'
    })
    .when('/logout', {
      templateUrl: 'partials/logout.html',
      controller: 'keabookCtrl'
    })
    .when('/users', {
      templateUrl: 'partials/users.html',
      controller: 'keabookCtrl'
    })
    .when('/activities', {
      templateUrl: 'partials/activities.html',
      controller: 'keabookCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});