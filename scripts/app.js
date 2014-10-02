'use strict';

// Defining our angular module
var keabookApp = angular.module('keabook', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.gravatar']);

// Configuring the tooltipProvider
keabookApp.config(['$tooltipProvider', function ($tooltipProvider) {
  $tooltipProvider.setTriggers({
    'mouseenter': 'mouseleave',
    'click': 'click',
    'focus': 'blur',
    'never': 'mouseleave' // <- This ensures the tooltip will go away on mouseleave
  });
}]);

// Configuring Gravatar
keabookApp.config([
  'gravatarServiceProvider', function(gravatarServiceProvider) {
    gravatarServiceProvider.defaults = {
      size     : 96,
      "default": 'mm'  // Mystery man as default for missing avatars
    };
    // Use https endpoint
    gravatarServiceProvider.secure = true;
  }
]);