keabookApp.controller('keabookCtrl', ['$scope', '$location', '$routeParams', '$timeout', '$modal',

  function ($scope, $location, $routeParams, $timeout, $modal) {

    // Function to initialize the profile
    $scope.init = function() {
      $scope.loadUser();
    };

    // Alerts
    $scope.alerts = [];
    // Function to push alert to the array
    $scope.pushAlert = function(alert) {
      $scope.alerts.push(alert);
      var lastindex  = $scope.alerts.length - 1;
      $timeout(function() {
        $scope.closeAlert(lastindex);
      }, 3000);
    };
    // Function to close alerts
    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    // Our user object
    $scope.users = [];
    $scope.user = {};

    // We check if users exists in localstorage
    if(localStorage.users) {
      $scope.users = JSON.parse(localStorage.users);
    } else {
      // And if not, we create two dummy users
      $scope.users = {
        "user": [
          {
            "uid" : 0,
            "firstName" : "Andrei",
            "lastName" : "Horodinca",
            "emailAddress" : "ah@kirkeweb.dk",
            "password" : "lalala",
            "loggedIn" : false,
            "isAdmin" : true,
            "isBlocked" : false,
            "profileInfo" : true,
            "birthday" : "28/09/1993",
            "location" : "Copenhagen, Denmark",
            "bio" : "Lorem ipsum dolor sit amet."
          },
          {
            "uid" : 1,
            "firstName" : "John",
            "lastName" : "Doe",
            "emailAddress" : "john.doe@hotmail.com",
            "password" : "lalala",
            "loggedIn" : false,
            "isAdmin" : false,
            "isBlocked" : false,
            "profileInfo" : false
          }
        ]
      };

      localStorage.setItem("users", JSON.stringify($scope.users));
    }

    // Our activity object
    $scope.activities = {activity: []};

    // We check if activities exists in local storage
    if(localStorage.activities) {
      $scope.activities = JSON.parse(localStorage.activities);
    } else {
      // And if not, we create it
      localStorage.setItem("activities", JSON.stringify($scope.activities));
    }

    // Our comments object
    $scope.comments = {comment: []};

    // We check if comments exists in local storage
    if(localStorage.comments) {
      $scope.comments = JSON.parse(localStorage.comments);
    } else {
      // And if not, we create it
      localStorage.setItem("comments", JSON.stringify($scope.comments));
    }

    // Our messages object
    $scope.messages = {message: []};

    // We check if comments exists in local storage
    if(localStorage.messages) {
      $scope.messages = JSON.parse(localStorage.messages);
    } else {
      // And if not, we create it
      localStorage.setItem("messages", JSON.stringify($scope.messages));
    }

    // Set the uid as route parameter for the user profile
    if(typeof $routeParams.uid == "undefined") {
      $scope.users.user.uid = -1;
    }
    else {
      $scope.users.user.uid = $routeParams.uid;
    }

    // Get the user based on the uid to show the profile
    angular.forEach($scope.users.user, function(user, key) {
      if(user.uid == $routeParams.uid) {
        $scope.publicUser = user;
      }
    });

    // Get the logged in user
    for (var k = 0; k < $scope.users.user.length; k++) {
      if ($scope.users.user[k].loggedIn == true) {
        $scope.loggedUser = $scope.users.user[k];
      }
    }

    // Called when view needs to be changed
    $scope.changeView = function (view) {
      $location.path(view);
    };

    // Register users in local storage
    $scope.registerUser = function (isValid) {

      $scope.regSuccess = false;

      // If everything in the forms seems right
      if (isValid) {
        $scope.user.uid = $scope.users.user.length;
        $scope.user.loggedIn = false;
        $scope.user.isAdmin = false;
        $scope.user.isBlocked = false;
        $scope.user.profileInfo = false;

        $scope.users.user.push($scope.user);
        localStorage.users = JSON.stringify($scope.users);

        // We hide the form and tell the user the registration succeeded
        $('#registerForm').hide();
        $scope.regSuccess = true;

        // And redirect to the login form
        $timeout(function () {
          $scope.changeView('login');
        }, 1500);

      } else {
        $scope.pushAlert({type: 'warning', msg: "Something went wrong. Try again."});
      }
    };

    // Check for match in local storage to login user
    $scope.loginUser = function() {

      $scope.loginSuccess = false;

      var loginEmail = $('#loginEmail');
      var loginPass = $('#loginPass');
      var loginBtn = $('#loginBtn');

      for (var i = 0; i < $scope.users.user.length; i++) {

        // We check if everything is right
        if (loginEmail.val() == $scope.users.user[i].emailAddress &&
            loginPass.val() == $scope.users.user[i].password &&
            $scope.users.user[i].loggedIn == false) {

          // We hide the form and tell the user the login succeeded
          $('#loginForm').hide();
          $scope.loginSuccess = true;

          // We update local storage
          $scope.users.user[i].loggedIn = true;
          localStorage.users = JSON.stringify($scope.users);

          // And redirect to his profile
          $timeout(function () {
            $scope.changeView('myprofile');
            // And load the data
            $scope.loadUser();
          }, 1500);

        } else {
          if ($scope.users.user[i].loggedIn == true) {
            $scope.pushAlert({type: 'warning', msg: "You are already logged in."});
          }
        }
      }
    };

    // Function to load the necessary UI elements for the logged in user
    $scope.loadUser = function() {

      for (var i = 0; i < $scope.users.user.length; i++) {

        if ($scope.users.user[i].loggedIn == true) {
          $('#homeLink').attr('href', '#myprofile');
          $('#brandLink').attr('href', '#myprofile');
          $('#startNavBar').hide();
          $('#userNavBar').show();
          $('#usersLink').show();
          $('#activitiesLink').show();
          $('#userName').text($scope.users.user[i].firstName + " " + $scope.users.user[i].lastName);
        }
      }
    };

    // Function to logout user. TODO Check why logout doesn't work on first click
    $scope.logoutUser = function() {

      $scope.logoutSuccess = false;

      for (var i = 0; i < $scope.users.user.length; i++) {

        // If there is a logged in user, we log him out
        if ($scope.users.user[i].loggedIn == true) {
          $scope.logoutSuccess = true;

          $scope.users.user[i].loggedIn = false;
          localStorage.users = JSON.stringify($scope.users);

          // And change the views
          $scope.changeView('/logout');

          // And remove the logged-in specific UI elements
          $timeout(function () {
            $scope.changeView('/');
            $('#userNavBar').hide();
            $('#usersLink').hide();
            $('#activitiesLink').hide();
            $('#startNavBar').show();
            $('#homeLink').attr('href', '#');
            $('#brandLink').attr('href', '#');
          }, 1500);
        }
      }
    };

    // Modal to edit your profile
    $scope.editProfile = function() {

      // We initialize the modal
      var modalEditProfileInstance = $modal.open({
        scope: $scope,
        templateUrl: 'templates/modalEditProfile.html',
        controller: function ($scope, $modalInstance) {
          // Called when ready to make the changes
          $scope.save = function() {

            for (var i = 0; i < $scope.users.user.length; i++) {

              if ($scope.users.user[i].loggedIn == true) {

                $scope.users.user[i].birthday = $('#profileBirthday').val();
                $scope.users.user[i].location = $('#profileLocation').val();
                $scope.users.user[i].bio = $('#profileBio').val();
                $scope.users.user[i].profileInfo = true;

                if ($scope.users.user[i].birthday == "" || $scope.users.user[i].birthday == null) {
                  $scope.users.user[i].birthday = "You haven't set your birthday yet.";
                }
                if ($scope.users.user[i].location == "" || $scope.users.user[i].location == null) {
                  $scope.users.user[i].location = "You haven't set your location yet.";
                }
                if ($scope.users.user[i].bio == "" || $scope.users.user[i].bio == null) {
                  $scope.users.user[i].bio = "You haven't written anything about you yet.";
                }

                $scope.pushAlert({type: 'info', msg: "Your profile has been updated."});
                localStorage.users = JSON.stringify($scope.users);

                $modalInstance.dismiss('cancel');
              }
            }
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    };

    // Simply update your account settings
    $scope.changeAccountSettings = function() {

      for (var i = 0; i < $scope.users.user.length; i++) {

        if ($scope.users.user[i].loggedIn == true) {

          $scope.users.user[i].firstName = $('#editFirstName').val();
          $scope.users.user[i].lastName = $('#editLastName').val();
          $scope.users.user[i].emailAddress = $('#editEmail').val();
          $scope.users.user[i].password = $('#editPass').val();

          if ($scope.users.user[i].firstName == "" || $scope.users.user[i].firstName == null) {
            $scope.users.user[i].firstName = "John";
          }
          if ($scope.users.user[i].lastName == "" || $scope.users.user[i].lastName == null) {
            $scope.users.user[i].lastName = "Doe";
          }
          if ($scope.users.user[i].emailAddress == "" || $scope.users.user[i].emailAddress == null) {
            $scope.users.user[i].emailAddress = "john.doe@gmail.com";
          }

          $scope.pushAlert({type: 'info', msg: "Your account has been updated."});
          localStorage.users = JSON.stringify($scope.users);

          $('#saveAccountSettings').html("<i class='fa fa-check'></i> Saved").removeClass('btn-primary').addClass('btn-success');
        }
      }
    };

    // Edit the information of another user (admin only)
    $scope.editUser = function() {

      var modalEditUserInstance = $modal.open({
        scope: $scope,
        templateUrl: 'templates/modalEditUser.html',
        controller: function ($scope, $modalInstance) {
          // Called when ready to make the changes
          $scope.saveUser = function() {
            $scope.publicUser.firstName = $('#userFirstName').val();
            $scope.publicUser.lastName = $('#userLastName').val();
            $scope.publicUser.emailAddress = $('#userEmail').val();

            localStorage.users = JSON.stringify($scope.users);

            $scope.pushAlert({type: 'info', msg: "The user has been updated."});
            $modalInstance.dismiss('cancel');
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    };

    // Change the role of another user (admin only)
    $scope.changeRole = function(size) {

      var modalChangeRoleInstance = $modal.open({
        scope: $scope,
        templateUrl: 'templates/modalChangeRole.html',
        size: size,
        controller: function ($scope, $modalInstance) {
          // Called when ready to make the changes
          $scope.saveRole = function() {

            if ($scope.publicUser.isAdmin == false) {
              $scope.publicUser.isAdmin = true;
              $scope.pushAlert({type: 'info', msg: "The user is now an admin."});
            } else {
              $scope.publicUser.isAdmin = false;
              $scope.pushAlert({type: 'info', msg: "The user is no longer admin."});
            }

            localStorage.users = JSON.stringify($scope.users);

            $modalInstance.dismiss('cancel');
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    };

    // Block access for another user (admin only)
    $scope.blockUser = function() {

      var modalBlockUserInstance = $modal.open({
        scope: $scope,
        templateUrl: 'templates/modalBlockUser.html',
        controller: function ($scope, $modalInstance) {
          // Called when ready to make the changes
          $scope.block = function() {

            if ($scope.publicUser.isBlocked == false) {
              $scope.publicUser.isBlocked = true;
              $scope.pushAlert({type: 'warning', msg: 'The user has been blocked.'});
            } else {
              $scope.publicUser.isBlocked = false;
              $scope.pushAlert({type: 'warning', msg: 'The user has been unblocked.'});
            }

            localStorage.users = JSON.stringify($scope.users);

            $modalInstance.dismiss('cancel');
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    };

    // Permanently delete another user (admin only)
    $scope.deleteUser = function(user) {
      var index = $scope.users.user.indexOf(user);

      var modalDeleteUserInstance = $modal.open({
        scope: $scope,
        templateUrl: 'templates/modalDeleteUser.html',
        controller: function ($scope, $modalInstance) {
          // Called when ready to make the changes
          $scope.removeUser = function() {
            $scope.users.user.splice(index, 1);
            localStorage.users = JSON.stringify($scope.users);

            $scope.pushAlert({type: 'danger', msg: 'The user has been deleted.'});

            $timeout(function () {
              $scope.changeView('users');
            }, 1000);

            $modalInstance.dismiss('cancel');
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    };

    // Called when we need to get the activities for the logged in user
    $scope.getLoggedUserActivities = function(activity) {
      if(activity.uid != $scope.loggedUser.uid) {
        return false;
      }
      return true;
    };

    // Called when we need to get the activities for a specific user profile (based on uid)
    $scope.getPublicUserActivities = function(activity) {
      if(activity.uid != $routeParams.uid) {
        return false;
      }
      return true;
    };

    // We create new activities (status updates)
    $scope.newActivity = function() {

      var modalNewActivityInstance = $modal.open({
        scope: $scope,
        templateUrl: 'templates/modalCreateActivity.html',
        controller: function ($scope, $modalInstance) {
          // Called when ready to make the changes
          $scope.postActivity = function () {

            var aid = $scope.activities.activity.length;
            var uid = $scope.loggedUser.uid;
            var title = $scope.loggedUser.firstName + ' ' + $scope.loggedUser.lastName;
            var picture = $scope.loggedUser.emailAddress;
            var date = new Date();
            var isAdmin = $scope.loggedUser.isAdmin;
            var body = $('#activityText').val();

              // We push the activity details to the array
              $scope.activities.activity.push(
                {
                  "aid" : aid,
                  "uid" : uid,
                  "title" : title,
                  "picture" : picture,
                  "date" : date,
                  "body" : body,
                  "isAdmin" : isAdmin
                }
              );

              localStorage.activities = JSON.stringify($scope.activities);

              $scope.pushAlert({type: 'success', msg: 'Your update has been posted.'});
              $modalInstance.dismiss('cancel');
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    };

    // Delete activities (admins can delete any user's activities and anyone can delete their own)
    $scope.deleteActivity = function(activity) {
      var index = $scope.activities.activity.indexOf(activity);

      var modalDeleteActivityInstance = $modal.open({
        scope: $scope,
        templateUrl: 'templates/modalDeleteActivity.html',
        controller: function ($scope, $modalInstance) {
          // Called when ready to make the changes
          $scope.remove = function() {

            $scope.activities.activity.splice(index, 1);
            localStorage.activities = JSON.stringify($scope.activities);

            $scope.pushAlert({type: 'danger', msg: 'The activity has been deleted.'});

            $modalInstance.dismiss('cancel');
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    };

    // We create new comments (to posts)
    $scope.newComment = function(activity) {

      var modalNewCommentInstance = $modal.open({
        scope: $scope,
        templateUrl: 'templates/modalCreateComment.html',
        controller: function ($scope, $modalInstance) {
          // Called when ready to make the changes
          $scope.postComment = function () {

            var cid = $scope.comments.comment.length;
            var aid = activity.aid;
            var uid = $scope.loggedUser.uid;
            var title = $scope.loggedUser.firstName + ' ' + $scope.loggedUser.lastName;
            var picture = $scope.loggedUser.emailAddress;
            var date = new Date();
            var isAdmin = $scope.loggedUser.isAdmin;
            var body = $('#commentText').val();

            // We push the activity details to the array
            $scope.comments.comment.push(
              {
                "cid" : cid,
                "aid" : aid,
                "uid" : uid,
                "title" : title,
                "picture" : picture,
                "date" : date,
                "body" : body,
                "isAdmin" : isAdmin
              }
            );

            localStorage.comments = JSON.stringify($scope.comments);

            $scope.pushAlert({type: 'success', msg: 'Your comment has been posted.'});
            $modalInstance.dismiss('cancel');

          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    };

    // Called when we need to get the comments for the respective activity
    $scope.getActivityComments = function(activity) {
      if(activity.aid != $scope.comments.comment.aid) {
        return false;
      }
      return true;
    };

    // Delete comments (admins can delete any user's comments and anyone can delete their own)
    $scope.deleteComment = function(comment) {
      var index = $scope.comments.comment.indexOf(comment);

      var modalDeleteCommentInstance = $modal.open({
        scope: $scope,
        templateUrl: 'templates/modalDeleteComment.html',
        controller: function ($scope, $modalInstance) {
          // Called when ready to make the changes
          $scope.remove = function() {

            $scope.comments.comment.splice(index, 1);
            localStorage.comments = JSON.stringify($scope.comments);

            $scope.pushAlert({type: 'danger', msg: 'The comment has been deleted.'});

            $modalInstance.dismiss('cancel');
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    };

    // We create new private message
    $scope.newMessage = function() {

      var modalNewMessageInstance = $modal.open({
        scope: $scope,
        templateUrl: 'templates/modalCreateMessage.html',
        controller: function ($scope, $modalInstance) {
          // Called when ready to make the changes
          $scope.sendMessage = function () {

            var from = $scope.loggedUser.uid;
            var fromName = $scope.loggedUser.firstName + ' ' + $scope.loggedUser.lastName;
            var fromPicture = $scope.loggedUser.emailAddress;
            var to = $scope.publicUser.uid;
            var toName = $scope.publicUser.firstName + ' ' + $scope.publicUser.lastName;
            var toPicture = $scope.publicUser.emailAddress;
            var mid = $scope.messages.message.length;
            var date = new Date();
            var body = $('#messageText').val();

            // We push the activity details to the array
            $scope.messages.message.push(
              {
                "from" : from,
                "fromName" : fromName,
                "fromPicture" : fromPicture,
                "to" : to,
                "toName" : toName,
                'toPicture' : toPicture,
                "mid" : mid,
                "date" : date,
                "body" : body,
              }
            );

            localStorage.messages = JSON.stringify($scope.messages);

            $scope.pushAlert({type: 'success', msg: 'Your message has been sent.'});
            $modalInstance.dismiss('cancel');
          };

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    };

    // Delete messages
    $scope.deleteMessage = function(message) {
      var index = $scope.messages.message.indexOf(message);

      var modalDeleteMessageInstance = $modal.open({
        scope: $scope,
        templateUrl: 'templates/modalDeleteMessage.html',
        controller: function ($scope, $modalInstance) {
          // Called when ready to make the changes
          $scope.remove = function() {

            $scope.messages.message.splice(index, 1);
            localStorage.messages = JSON.stringify($scope.messages);

            $scope.pushAlert({type: 'danger', msg: 'The message has been deleted.'});

            $modalInstance.dismiss('cancel');
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
          }
        }
      });
    };

}]);