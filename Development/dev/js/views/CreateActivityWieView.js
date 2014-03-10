appData.views.CreateActivityWieView = Backbone.View.extend({
    initialize: function () {
        appData.views.friendsListView = [];
        appData.collections.selectedFriends = new UsersCollection();
        appData.views.CreateActivityWieView.activityCreatedHandler = this.activityCreatedHandler;
        appData.views.CreateActivityWieView.friendsInvitedHandler = this.friendsInvitedHandler;

        $(appData.models.userModel.attributes.myFriends.models).each(function(index, userModel) {
            appData.views.friendsListView.push(new appData.views.FriendInvitieView({
              model:userModel,
            }));
        });
    },

    render: function() { 
      this.$el.html(this.template(this.model.attributes));
      appData.settings.currentModuleHTML = this.$el;
      
      _(appData.views.friendsListView).each(function(listView) {
          $('#friendsList', appData.settings.currentModuleHTML).append(listView.render().$el);
      });

      this.setValidator();
      return this; 
    },

    setValidator: function(){
    	var that = this;
        $("#wieForm",appData.settings.currentModuleHTML).validate({
            submitHandler: function(form){
              
              Backbone.on('activityCreated', appData.views.CreateActivityWieView.activityCreatedHandler);
              appData.services.phpService.createActivity(appData.views.ActivityDetailView.model);
            }
        });
    },

    activityCreatedHandler: function(activity_id){

      // now add friends
      Backbone.off('activityCreated');
      appData.views.CreateActivityWieView.activity_id = activity_id;

      if(appData.collections.selectedFriends.length > 0){
        Backbone.on('friendsInvitedHandler', appData.views.CreateActivityWieView.friendsInvitedHandler);
        appData.services.phpService.inviteFriends(appData.collections.selectedFriends, activity_id);
      }else{
        appData.services.phpService.getActivities(false, appData.views.CreateActivityWieView.activity_id);
      }

    },

    friendsInvitedHandler: function(){
      Backbone.off('friendsInvitedHandler');      
      appData.services.phpService.getActivities(false, appData.views.CreateActivityWieView.activity_id);
    }

});